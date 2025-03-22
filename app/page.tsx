import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to SiteSentry
        </h1>
        <p className="text-xl text-center mb-12">
          AI-Powered Web Maintenance Platform
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link> 
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    title: 'AI-Driven Maintenance',
    description: 'Leverage multiple AI agents to automatically maintain and optimize your website'
  },
  {
    title: 'Real-time Monitoring',
    description: 'Get instant insights into your website performance and health status'
  },
  {
    title: 'Automated Updates',
    description: 'Keep your website up-to-date with automated content and SEO optimization'
  },
  {
    title: 'Error Detection',
    description: 'Identify and fix issues before they impact your users'
  },
  {
    title: 'Performance Optimization',
    description: 'Automatically optimize your website speed and performance'
  },
  {
    title: 'Content Generation',
    description: 'Generate fresh, relevant content to keep your website engaging'
  }
];
