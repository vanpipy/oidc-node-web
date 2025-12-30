import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = [
    { id: 'p-1001', name: 'Wireless Headphones', price: 129.99, description: 'Noise-cancelling over-ear headphones' },
    { id: 'p-1002', name: 'Smartwatch', price: 199.0, description: 'Fitness tracking and notifications' },
    { id: 'p-1003', name: 'Mechanical Keyboard', price: 89.5, description: 'RGB backlit, blue switches' },
  ];

  return NextResponse.json({ products });
}
