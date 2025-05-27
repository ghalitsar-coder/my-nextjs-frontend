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
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:scale-105 transform transition-transform">
              <div className="text-blue-500 text-3xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold mb-2">Original API Test</h3>
              <p className="text-gray-600">Test the basic API connection between Next.js and Spring Boot</p>
            </div>
          </Link>

          {/* Hono Test Card */}
          <Link href="/hono-test" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:scale-105 transform transition-transform">
              <div className="text-orange-500 text-3xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Hono API Test</h3>
              <p className="text-gray-600">Test the new Hono-powered API endpoints with enhanced features</p>
            </div>
          </Link>

          {/* Cart Demo Card */}
          <Link href="/cart" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group-hover:scale-105 transform transition-transform">
              <div className="text-green-500 text-3xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Shopping Cart</h3>
              <p className="text-gray-600">Demo shopping cart functionality powered by Hono API</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Technology Stack</h2>
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
          <h3 className="font-semibold text-yellow-800 mb-2">🔥 Hono Benefits</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Ultra-fast performance with minimal overhead</li>
            <li>• Built-in TypeScript support for better development experience</li>
            <li>• Middleware support for authentication, CORS, and more</li>
            <li>• Edge Runtime compatibility for global deployment</li>
            <li>• Simple and intuitive API design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/api-test"
          >
            🔌 Test Spring Boot API
          </a>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
