import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Image
            className="mx-auto mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={200}
            height={40}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coffee & Food Ordering System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js + Hono + Spring Boot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* API Test Card */}
          <Link href="/api-test" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <div className="text-blue-500 text-3xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold mb-2">Original API Test</h3>
              <p className="text-gray-600">
                Test the basic API connection between Next.js and Spring Boot
              </p>
            </div>
          </Link>

          {/* Hono Test Card */}
          <Link href="/hono-test" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <div className="text-orange-500 text-3xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Hono API Test</h3>
              <p className="text-gray-600">
                Test the new Hono-powered API endpoints with enhanced features
              </p>
            </div>
          </Link>

          {/* Cart Demo Card */}
          <Link href="/cart" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <div className="text-green-500 text-3xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Shopping Cart</h3>
              <p className="text-gray-600">
                Demo shopping cart functionality powered by Hono API
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Frontend</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Next.js 14</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">API Layer</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Hono.js</li>
                <li>API Routes</li>
                <li>Middleware</li>
                <li>Type Safety</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Backend</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Spring Boot</li>
                <li>Java</li>
                <li>REST API</li>
                <li>Database</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🔥 Hono Benefits
          </h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Ultra-fast performance with minimal overhead</li>
            <li>
              • Built-in TypeScript support for better development experience
            </li>
            <li>• Middleware support for authentication, CORS, and more</li>
            <li>• Edge Runtime compatibility for global deployment</li>
            <li>• Simple and intuitive API design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
