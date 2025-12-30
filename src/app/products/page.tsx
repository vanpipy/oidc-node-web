import { redirect } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { getSession } from '@/lib/session';

export default async function ProductsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  // Fetch from the API with absolute URL and forward cookies for auth
  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      Cookie: headersList.get('cookie') || '',
    },
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <p className="text-red-600 dark:text-red-400">Failed to load products.</p>
            <div className="mt-6">
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = await res.json();
  const products: Array<{ id: string; name: string; price: number; description: string }> = data.products || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Products</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Dashboard</Link>
              <Link href="/api/auth/logout" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Logout</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((p) => (
                  <li key={p.id} className="py-4 flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{p.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">${p.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {p.id}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
