function TipsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tips & Best Practices</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quick steps to harden your business accounts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Harden Access</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Enable multi-factor authentication (MFA)</li>
            <li>Limit admin roles to trusted staff</li>
            <li>Use a password manager for strong credentials</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Verify Links</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Hover to check the real domain</li>
            <li>Use the Verify Link tool before opening</li>
            <li>Avoid shortened URLs when possible</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Train Your Team</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Run monthly phishing simulations</li>
            <li>Use clear reporting channels</li>
            <li>Share real incident examples</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Monitor & Respond</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Review admin activity weekly</li>
            <li>Revoke access after staff changes</li>
            <li>Report suspected incidents quickly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export { TipsPage }
