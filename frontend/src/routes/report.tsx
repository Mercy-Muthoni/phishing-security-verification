import { useState, type FormEvent } from 'react'

function ReportPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('http://localhost:5000/api/report-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          reporterName: name,
          reporterEmail: email,
          details,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Report failed')
      }

      setStatus('success')
      setMessage(data.message || 'Report submitted.')
      setUrl('')
      setDetails('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Report failed'
      setStatus('error')
      setMessage(message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report an Incident</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share details of a suspected phishing attempt.
        </p>
      </div>

      <form className="space-y-6 rounded-lg bg-white p-6 shadow" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Your name</label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Jane Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Suspicious link</label>
          <input
            type="url"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="https://example.com/login"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Incident details</label>
          <textarea
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={5}
            placeholder="Describe what happened, include URLs or screenshots if possible."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          />
        </div>
        {status !== 'idle' ? (
          <div
            className={[
              'rounded-md border px-4 py-3 text-sm',
              status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
              status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : '',
              status === 'loading' ? 'border-gray-200 bg-gray-50 text-gray-700' : '',
            ].join(' ')}
          >
            {status === 'loading' ? 'Submitting report...' : message}
          </div>
        ) : null}
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}

export { ReportPage }
