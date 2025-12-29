import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthorizationUrl } from '@/lib/oidc';

export async function GET() {
  try {
    const { url, codeVerifier, state } = await getAuthorizationUrl();

    // Store code verifier and state in cookies for callback verification
    const cookieStore = await cookies();
    cookieStore.set('oidc_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    cookieStore.set('oidc_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
