import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const now = Math.floor(Date.now() / 1000);
  const isExpired = session.expiresAt <= now;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">OIDC Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/api/auth/logout"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Welcome, {session.user.name || session.user.preferred_username || 'User'}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You have successfully authenticated using Aliyun OIDC.
                </p>
              </div>
            </div>

            {/* User Information Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">User Information</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {session.user.sub}
                    </dd>
                  </div>
                  {session.user.name && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {session.user.name}
                      </dd>
                    </div>
                  )}
                  {session.user.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {session.user.email}
                      </dd>
                    </div>
                  )}
                  {session.user.preferred_username && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {session.user.preferred_username}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Session Information Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Session Information</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Session Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isExpired 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Expires At</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(session.expiresAt * 1000).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Access Token</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono truncate">
                      {session.accessToken.substring(0, 20)}...
                    </dd>
                  </div>
                  {session.idToken && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Token</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono truncate">
                        {session.idToken.substring(0, 20)}...
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="flex gap-4">
                  <Link
                    href="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/products"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
