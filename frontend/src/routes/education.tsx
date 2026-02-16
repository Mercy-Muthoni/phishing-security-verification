function EducationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <p className="mt-1 text-sm text-gray-500">
          Learn the basics of social media phishing and how to spot it.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Common Attack Types</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Spear-phishing targeting business admins</li>
            <li>Fake support or verification messages</li>
            <li>Malicious links shared via DMs</li>
            <li>Clone accounts impersonating brands</li>
          </ul>
        </section>
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Red Flags</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Urgent requests to log in or reset credentials</li>
            <li>Shortened links or mismatched domains</li>
            <li>Unexpected invoices or attachments</li>
            <li>Requests for verification codes</li>
          </ul>
        </section>
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Employee Training</h2>
          <p className="mt-3 text-sm text-gray-600">
            Build a short monthly program covering safe link practices, MFA, and
            how to report suspicious messages.
          </p>
        </section>
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Safe Response Steps</h2>
          <p className="mt-3 text-sm text-gray-600">
            Never click the link directly. Verify the request using official
            channels and report the message internally.
          </p>
        </section>
      </div>
    </div>
  )
}

export { EducationPage }
