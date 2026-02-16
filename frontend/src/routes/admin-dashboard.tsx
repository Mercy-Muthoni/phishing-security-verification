function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage resources, posts, and incident reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          <p className="mt-3 text-sm text-gray-600">12 pending review</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Education Posts</h2>
          <p className="mt-3 text-sm text-gray-600">8 published</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">News Updates</h2>
          <p className="mt-3 text-sm text-gray-600">3 drafts</p>
        </div>
      </div>
    </div>
  )
}

export { AdminDashboardPage }
