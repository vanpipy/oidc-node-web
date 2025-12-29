import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">OIDC Node Web</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Aliyun OIDC Integration with Next.js, React, and TypeScript
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {session ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome back!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                You are currently logged in as <strong>{session.user.email || session.user.sub}</strong>
              </p>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Get Started</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in with your Aliyun OIDC account to access the application.
              </p>
              <Link
                href="/api/auth/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in with OIDC
              </Link>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Aliyun OIDC authentication integration</li>
            <li>Secure session management with JWT</li>
            <li>Protected routes and middleware</li>
            <li>Built with Next.js 15, React 19, and TypeScript</li>
            <li>Modern UI with Tailwind CSS</li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Configure your OIDC settings in the .env file</p>
        </div>
      </div>
    </div>
  );
}
