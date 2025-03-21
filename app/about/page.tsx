export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            About SiteSentry
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Empowering website owners with AI-driven maintenance solutions
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600">
                SiteSentry aims to revolutionize website maintenance by leveraging
                artificial intelligence to automate routine tasks, detect issues,
                and optimize performance. We believe in making website management
                accessible and efficient for everyone.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-600">
                Our AI agents continuously monitor your website, perform routine
                maintenance tasks, and alert you to potential issues. They can
                handle everything from content updates to performance optimization,
                saving you time and ensuring your site stays in top condition.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Automated Monitoring
              </h3>
              <p className="text-gray-600">
                Continuous monitoring of your website's health, performance, and
                security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Maintenance
              </h3>
              <p className="text-gray-600">
                AI-powered maintenance tasks that keep your website running
                smoothly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Alerts
              </h3>
              <p className="text-gray-600">
                Instant notifications when issues are detected or maintenance is
                needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 