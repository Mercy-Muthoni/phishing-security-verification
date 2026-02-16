import { useState } from 'react'

function VerifyLinkPage() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'suspicious' | 'caution' | 'unknown' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<string | null>(null)

  async function handleVerify() {
    if (!url.trim()) {
      setStatus('error')
      setMessage('Please enter a URL to verify.')
      return
    }

    setStatus('loading')
    setMessage('')
    setDetails(null)

    try {
      const response = await fetch('http://localhost:5000/api/verify-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      if (data.status === 'suspicious') {
        setStatus('suspicious')
        setMessage('This link is a known phishing URL. Do not open it.')
      } else if (data.status === 'caution') {
        setStatus('caution')
        setMessage('This domain appears in the suspicious list. Be cautious.')
      } else {
        setStatus('unknown')
        setMessage('Link verified. It’s safe to proceed.')
      }

      if (data.matched) {
        setDetails(JSON.stringify(data.matched, null, 2))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Verification failed'
      setStatus('error')
      setMessage(message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Verify Link</h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste a URL to check for suspicious patterns.
        </p>
      </div>

      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        <label className="block text-sm font-medium text-gray-700">
          URL to verify
        </label>
        <input
          type="url"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://example.com/login"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          onClick={handleVerify}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Checking...' : 'Analyze link'}
        </button>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          This tool checks for exact and domain-level matches in the suspicious list.
        </div>

        {status !== 'idle' ? (
          <div
            className={[
              'rounded-md border px-4 py-3 text-sm',
              status === 'suspicious' ? 'border-red-200 bg-red-50 text-red-700' : '',
              status === 'caution' ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
              status === 'unknown' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
              status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : '',
              status === 'loading' ? 'border-gray-200 bg-gray-50 text-gray-700' : '',
            ].join(' ')}
          >
            <div className="font-medium">{message}</div>
            {details ? (
              <pre className="mt-2 whitespace-pre-wrap rounded bg-white/70 p-2 text-xs text-gray-600">
                {details}
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { VerifyLinkPage }
