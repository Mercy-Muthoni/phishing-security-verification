function HomePage() {
  return (
    <div className="py-8">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Protect Kenyan Businesses from Social Media Phishing
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          An informational portal dedicated to educating businesses about phishing attacks and prevention strategies.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Educational Resources</h3>
            <p className="mt-2 text-sm text-gray-500">
              Learn about different types of phishing attacks and how to prevent them.
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Latest News</h3>
            <p className="mt-2 text-sm text-gray-500">
              Stay updated with recent phishing incidents and trends.
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Best Practices</h3>
            <p className="mt-2 text-sm text-gray-500">
              Practical tips for avoiding phishing attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HomePage }
