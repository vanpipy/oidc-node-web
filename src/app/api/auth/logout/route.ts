import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await deleteSession();
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
