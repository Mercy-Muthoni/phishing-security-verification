class PhishingFeedIngestor {
  constructor({ PhishingLink, normalizeUrl, logger = console, intervalMs = 12 * 60 * 60 * 1000 }) {
    this.PhishingLink = PhishingLink;
    this.normalizeUrl = normalizeUrl;
    this.logger = logger;
    this.intervalMs = intervalMs;
    this.timer = null;
  }

  async fetchPhishTank(limit = 100) {
    this.logger.log('Fetching data from PhishTank...');
    const response = await fetch('https://data.phishtank.com/data/online-valid.json', {
      headers: { 'User-Agent': 'phishtank/your_username_here' },
    });
    if (!response.ok) {
      throw new Error(`PhishTank request failed: ${response.status}`);
    }
    const data = await response.json();
    return data.slice(0, limit).map((item) => item.url).filter(Boolean);
  }

  async fetchOpenPhish(limit = 100) {
    this.logger.log('Fetching data from OpenPhish...');
    const response = await fetch('https://openphish.com/feed.txt');
    if (!response.ok) {
      throw new Error(`OpenPhish request failed: ${response.status}`);
    }
    const text = await response.text();
    return text.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, limit);
  }

  async fetchUrlScan(limit = 100) {
    this.logger.log('Fetching data from URLScan...');
    const size = Math.min(limit, 100);
    const response = await fetch(`https://urlscan.io/api/v1/search/?q=tags:phishing&size=${size}`);
    if (!response.ok) {
      throw new Error(`URLScan request failed: ${response.status}`);
    }
    const payload = await response.json();
    const results = payload.results || [];
    return results.map((result) => result?.page?.url).filter(Boolean).slice(0, limit);
  }

  async storeUniqueLinks(source, links) {
    const operations = [];
    let invalid = 0;

    for (const link of links) {
      try {
        const { normalizedUrl, domain } = this.normalizeUrl(link);
        operations.push({
          updateOne: {
            filter: { normalizedUrl },
            update: {
              $setOnInsert: {
                normalizedUrl,
                domain,
                source,
                notes: 'auto-ingested',
              },
              $set: { updatedAt: new Date() },
            },
            upsert: true,
          },
        });
      } catch (error) {
        invalid += 1;
      }
    }

    if (operations.length === 0) {
      return { inserted: 0, existing: 0, invalid };
    }

    const result = await this.PhishingLink.bulkWrite(operations, { ordered: false });
    const inserted = result.upsertedCount || 0;
    return {
      inserted,
      existing: operations.length - inserted,
      invalid,
    };
  }

  async ingestOnce(limitPerSource = 100) {
    const sources = {
      phishtank: () => this.fetchPhishTank(limitPerSource),
      openphish: () => this.fetchOpenPhish(limitPerSource),
      urlscan: () => this.fetchUrlScan(limitPerSource),
    };

    let totalInserted = 0;
    let totalExisting = 0;
    let totalInvalid = 0;

    for (const [sourceName, fetcher] of Object.entries(sources)) {
      try {
        const links = await fetcher();
        const summary = await this.storeUniqueLinks(sourceName, links);
        totalInserted += summary.inserted;
        totalExisting += summary.existing;
        totalInvalid += summary.invalid;
        this.logger.log(
          `[${sourceName}] fetched=${links.length} inserted=${summary.inserted} existing=${summary.existing} invalid=${summary.invalid}`
        );
      } catch (error) {
        this.logger.error(`[${sourceName}] ingestion failed:`, error.message);
      }
    }

    this.logger.log(
      `Phishing feed ingestion complete. inserted=${totalInserted} existing=${totalExisting} invalid=${totalInvalid}`
    );
  }

  start(limitPerSource = 100) {
    this.ingestOnce(limitPerSource).catch((error) => {
      this.logger.error('Initial phishing feed ingestion failed:', error.message);
    });

    this.timer = setInterval(() => {
      this.ingestOnce(limitPerSource).catch((error) => {
        this.logger.error('Scheduled phishing feed ingestion failed:', error.message);
      });
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = PhishingFeedIngestor;
