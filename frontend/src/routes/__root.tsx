import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

function RootLayout() {
  const location = useRouterState({ select: (state) => state.location })

  useEffect(() => {
    console.log('[route] navigate', location.pathname, location.search)
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
                SM
              </span>
              <div>
                <h1 className="text-lg font-semibold leading-none">Social Media Phishing Portal</h1>
                <p className="text-xs text-gray-500">Protect Kenyan businesses online</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="transition hover:text-gray-900">Home</Link>
              <Link to="/education" className="transition hover:text-gray-900">Education</Link>
              <Link to="/news" className="transition hover:text-gray-900">News</Link>
              <Link to="/tips" className="transition hover:text-gray-900">Tips</Link>
              <Link to="/report" className="transition hover:text-gray-900">Report</Link>
              <Link to="/verify-link" className="transition hover:text-gray-900">Verify</Link>
              <Link to="/admin-login" className="transition hover:text-gray-900">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export { RootLayout }
