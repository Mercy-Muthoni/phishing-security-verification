const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PhishingFeedIngestor = require('./services/phishingFeedIngestor');
require('dotenv').config();

const app = express();
let phishingFeedIngestor;

app.use(cors());
app.use(express.json());
const mongoUser = process.env.MONGO_USER;    
const mongoPass = process.env.MONGO_PASS;  
const mongoHost = process.env.MONGO_HOST || 'localhost:27017';
const mongoDb   = process.env.MONGO_DB   || 'phishing-portal';

let uri;
if (process.env.MONGO_URI) {
  uri = process.env.MONGO_URI;
} else if (mongoUser && mongoPass) {
  uri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?authSource=admin`;
} else {
  uri = `mongodb://${mongoHost}/${mongoDb}`; // no auth
}

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
    ensureDefaultAdmin().catch((error) => {
      console.error('Default admin bootstrap failed:', error);
    });
    seedSuspiciousLinks().catch((error) => {
      console.error('Suspicious link seed failed:', error);
    });
    if (phishingFeedIngestor) {
      phishingFeedIngestor.start(Number(process.env.INGEST_LIMIT_PER_SOURCE) || 100);
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API running'));

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

const phishingLinkSchema = new mongoose.Schema(
  {
    normalizedUrl: { type: String, required: true, unique: true },
    domain: { type: String, required: true, index: true },
    source: { type: String, default: 'seed' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const PhishingLink = mongoose.model('PhishingLink', phishingLinkSchema);
phishingFeedIngestor = new PhishingFeedIngestor({
  PhishingLink,
  normalizeUrl,
  intervalMs: (Number(process.env.INGEST_INTERVAL_HOURS) || 12) * 60 * 60 * 1000,
});

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Using an insecure default for development.');
}

async function ensureDefaultAdmin() {
  const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!defaultEmail || !defaultPassword) {
    console.warn('Default admin credentials are not set. Skipping bootstrap.');
    return;
  }

  const existingAdmin = await Admin.findOne({ email: defaultEmail });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 12);
  await Admin.create({ email: defaultEmail, passwordHash });
  console.log(`Default admin created for ${defaultEmail}`);
}

const seedLinks = [
  {
    url: 'http://secure-login.example.com',
    source: 'seed',
    notes: 'Example placeholder phishing domain',
  },
  {
    url: 'https://verify-account.example.net/login',
    source: 'seed',
    notes: 'Example placeholder phishing URL',
  },
  {
    url: 'http://bit.ly/fake-support',
    source: 'seed',
    notes: 'Example shortened URL',
  },
];

function normalizeDomain(hostname) {
  const lower = hostname.toLowerCase();
  return lower.startsWith('www.') ? lower.slice(4) : lower;
}

function normalizeUrl(input) {
  const trimmed = String(input).trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  const parsed = new URL(withProtocol);
  const domain = normalizeDomain(parsed.hostname);
  const pathname = parsed.pathname.replace(/\/+$/, '');
  const search = parsed.search;
  return {
    normalizedUrl: `${parsed.protocol}//${domain}${pathname}${search}`,
    domain,
  };
}

async function seedSuspiciousLinks() {
  for (const entry of seedLinks) {
    const { normalizedUrl, domain } = normalizeUrl(entry.url);
    await PhishingLink.updateOne(
      { normalizedUrl },
      {
        $setOnInsert: {
          normalizedUrl,
          domain,
          source: entry.source,
          notes: entry.notes,
        },
      },
      { upsert: true }
    );
  }
  console.log('Suspicious link seed complete');
}

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ sub: admin._id, email: admin.email }, jwtSecret, {
      expiresIn: '2h',
    });

    return res.json({
      token,
      admin: { email: admin.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/verify-link', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL is required.' });
  }

  let normalized;
  try {
    normalized = normalizeUrl(url);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL.' });
  }

  try {
    const exactMatch = await PhishingLink.findOne({
      normalizedUrl: normalized.normalizedUrl,
    });

    if (exactMatch) {
      return res.json({
        status: 'suspicious',
        matchType: 'exact',
        matched: {
          normalizedUrl: exactMatch.normalizedUrl,
          domain: exactMatch.domain,
          source: exactMatch.source,
          notes: exactMatch.notes,
        },
      });
    }

    const domainMatch = await PhishingLink.findOne({ domain: normalized.domain });
    if (domainMatch) {
      return res.json({
        status: 'caution',
        matchType: 'domain',
        matched: {
          domain: domainMatch.domain,
          source: domainMatch.source,
          notes: domainMatch.notes,
        },
      });
    }

    return res.json({
      status: 'unknown',
      matchType: 'none',
      matched: null,
    });
  } catch (error) {
    console.error('Verify link error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/report-link', async (req, res) => {
  const { url, reporterName, reporterEmail, details } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required.' });
  }

  let normalized;
  try {
    normalized = normalizeUrl(url);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL.' });
  }

  try {
    const update = {
      $setOnInsert: {
        normalizedUrl: normalized.normalizedUrl,
        domain: normalized.domain,
        source: 'user-report',
        notes: details || '',
      },
      $set: {
        updatedAt: new Date(),
      },
    };

    const result = await PhishingLink.findOneAndUpdate(
      { normalizedUrl: normalized.normalizedUrl },
      update,
      { upsert: true, new: true }
    );

    return res.json({
      message: 'Report submitted. Thank you for helping keep users safe.',
      saved: {
        normalizedUrl: result.normalizedUrl,
        domain: result.domain,
      },
      reporter: {
        name: reporterName || '',
        email: reporterEmail || '',
      },
    });
  } catch (error) {
    console.error('Report link error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 50);

    const [totalLinks, reportedLinks, seedLinksCount, recentLinks] = await Promise.all([
      PhishingLink.countDocuments({}),
      PhishingLink.countDocuments({ source: 'user-report' }),
      PhishingLink.countDocuments({ source: 'seed' }),
      PhishingLink.find({})
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('normalizedUrl domain source notes updatedAt createdAt'),
    ]);

    return res.json({
      metrics: {
        totalLinks,
        reportedLinks,
        seedLinks: seedLinksCount,
      },
      feeds: recentLinks.map((link) => ({
        url: link.normalizedUrl,
        domain: link.domain,
        source: link.source,
        notes: link.notes,
        updatedAt: link.updatedAt,
        createdAt: link.createdAt,
      })),
    });
  } catch (error) {
    console.error('News feed error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
