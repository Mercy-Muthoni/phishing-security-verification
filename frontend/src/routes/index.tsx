import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Social Media Phishing Portal</h1>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link to="/education" className="text-gray-500 hover:text-gray-900">Education</Link>
              <Link to="/news" className="text-gray-500 hover:text-gray-900">News</Link>
              <Link to="/tips" className="text-gray-500 hover:text-gray-900">Tips</Link>
              <Link to="/report" className="text-gray-500 hover:text-gray-900">Report</Link>
              <Link to="/verify-link" className="text-gray-500 hover:text-gray-900">Verify</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Protect Kenyan Businesses from Social Media Phishing
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              An informational portal dedicated to educating businesses about phishing attacks and prevention strategies.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Educational Resources</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Learn about different types of phishing attacks and how to prevent them.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Latest News</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Stay updated with recent phishing incidents and trends.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Best Practices</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Practical tips for avoiding phishing attacks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}