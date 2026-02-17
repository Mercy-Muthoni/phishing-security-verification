import { useEffect, useState } from 'react'

type FeedItem = {
  url: string
  domain: string
  source: string
  notes: string
  updatedAt: string
  createdAt: string
}

type Metrics = {
  totalLinks: number
  reportedLinks: number
  seedLinks: number
}

function NewsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadNews() {
      try {
        const response = await fetch('http://localhost:5000/api/news')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load news')
        }

        if (isMounted) {
          setFeeds(data.feeds || [])
          setMetrics(data.metrics || null)
          setStatus('ready')
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load news'
        if (isMounted) {
          setStatus('error')
          setMessage(message)
        }
      }
    }

    loadNews()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live feed of reported phishing links and attack trends.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 text-white shadow">
            <h3 className="text-lg font-semibold">Attack Metrics</h3>
            <p className="mt-1 text-sm text-gray-200">
              Snapshot of reported activity.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-200">Total links</div>
                <div className="mt-1 text-2xl font-semibold">
                  {metrics ? metrics.totalLinks : '—'}
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-200">Community reports</div>
                <div className="mt-1 text-2xl font-semibold">
                  {metrics ? metrics.reportedLinks : '—'}
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-200">Seeded alerts</div>
                <div className="mt-1 text-2xl font-semibold">
                  {metrics ? metrics.seedLinks : '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Complaints Summary</h3>
            <p className="mt-2 text-sm text-gray-600">
              Reports submitted by users are immediately added to the monitoring list
              and used to protect others.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-gray-500">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span>Active complaints</span>
                <span className="font-semibold text-gray-900">
                  {metrics ? metrics.reportedLinks : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span>New links today</span>
                <span className="font-semibold text-gray-900">
                  {feeds.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Circulating Links</h2>
            <span className="text-sm text-gray-500">
              Updated from community reports
            </span>
          </div>

          {status === 'loading' ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Loading phishing feeds...
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {message}
            </div>
          ) : null}

          {status === 'ready' && feeds.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No phishing links reported yet.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {feeds.map((item) => (
              <article key={item.url} className="rounded-lg bg-white p-6 shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900">{item.domain}</div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {item.source === 'user-report' ? 'Community report' : 'Seeded'}
                  </span>
                </div>
                <p className="mt-3 break-all text-sm text-gray-600">{item.url}</p>
                {item.notes ? (
                  <p className="mt-3 text-sm text-gray-500">{item.notes}</p>
                ) : null}
                <div className="mt-4 text-xs text-gray-400">
                  Last updated: {new Date(item.updatedAt).toLocaleString()}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export { NewsPage }
