import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeCodeForTokens, getUserInfo } from '@/lib/oidc';
import { createSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=missing_parameters', request.url));
    }

    // Verify state
    const cookieStore = await cookies();
    const storedState = cookieStore.get('oidc_state');
    const codeVerifier = cookieStore.get('oidc_code_verifier');

    if (!storedState || !codeVerifier) {
      return NextResponse.redirect(new URL('/?error=missing_cookies', request.url));
    }

    if (storedState.value !== state) {
      return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier.value);

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Create session
    const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;
    await createSession({
      user: userInfo,
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      expiresAt,
    });

    // Clean up temporary cookies
    cookieStore.delete('oidc_state');
    cookieStore.delete('oidc_code_verifier');

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=authentication_failed', request.url));
  }
}
