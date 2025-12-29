import * as oauth from 'openid-client';
import type { OIDCConfig, TokenSet, UserInfo } from '@/types/oidc';

let config: oauth.Configuration | null = null;

/**
 * Get OIDC configuration from environment variables
 */
export function getOIDCConfig(): OIDCConfig {
  const issuer = process.env.OIDC_ISSUER;
  const clientId = process.env.OIDC_CLIENT_ID;
  const clientSecret = process.env.OIDC_CLIENT_SECRET;
  const redirectUri = process.env.OIDC_REDIRECT_URI;

  if (!issuer || !clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required OIDC configuration');
  }

  return {
    issuer,
    clientId,
    clientSecret,
    redirectUri,
  };
}

/**
 * Get or initialize the OIDC configuration
 */
async function getConfiguration(): Promise<oauth.Configuration> {
  if (config) {
    return config;
  }

  const oidcConfig = getOIDCConfig();
  
  try {
    const issuerUrl = new URL(oidcConfig.issuer);
    const discoveryResponse = await oauth.discovery(
      issuerUrl,
      oidcConfig.clientId,
      oidcConfig.clientSecret
    );
    
    config = discoveryResponse;
    return config;
  } catch (error) {
    console.error('Failed to initialize OIDC configuration:', error);
    throw new Error('Failed to initialize OIDC configuration');
  }
}

/**
 * Generate authorization URL for OIDC login
 */
export async function getAuthorizationUrl(): Promise<{ url: string; codeVerifier: string; state: string }> {
  const configuration = await getConfiguration();
  const oidcConfig = getOIDCConfig();
  
  const codeVerifier = oauth.randomPKCECodeVerifier();
  const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
  const state = oauth.randomState();

  const authorizationUrl = new URL(configuration.serverMetadata().authorization_endpoint!);
  authorizationUrl.searchParams.set('client_id', oidcConfig.clientId);
  authorizationUrl.searchParams.set('redirect_uri', oidcConfig.redirectUri);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid profile email');
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');
  authorizationUrl.searchParams.set('state', state);

  return { url: authorizationUrl.toString(), codeVerifier, state };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenSet> {
  const configuration = await getConfiguration();
  const oidcConfig = getOIDCConfig();

  const currentUrl = new URL(oidcConfig.redirectUri);
  currentUrl.searchParams.set('code', code);

  const tokenEndpointResponse = await oauth.authorizationCodeGrant(
    configuration,
    currentUrl,
    {
      pkceCodeVerifier: codeVerifier,
      expectedState: undefined, // State is validated in the callback handler
    }
  );
  
  return {
    access_token: tokenEndpointResponse.access_token,
    token_type: tokenEndpointResponse.token_type || 'Bearer',
    expires_in: tokenEndpointResponse.expires_in || 3600,
    refresh_token: tokenEndpointResponse.refresh_token,
    id_token: tokenEndpointResponse.id_token,
  };
}

/**
 * Get user info using access token
 */
export async function getUserInfo(accessToken: string): Promise<UserInfo> {
  const configuration = await getConfiguration();
  const userinfoEndpoint = configuration.serverMetadata().userinfo_endpoint;

  if (!userinfoEndpoint) {
    throw new Error('Userinfo endpoint not available');
  }

  const response = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  const userinfo = await response.json();
  return userinfo as UserInfo;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenSet> {
  const configuration = await getConfiguration();

  const tokenEndpointResponse = await oauth.refreshTokenGrant(
    configuration,
    refreshToken
  );

  return {
    access_token: tokenEndpointResponse.access_token,
    token_type: tokenEndpointResponse.token_type || 'Bearer',
    expires_in: tokenEndpointResponse.expires_in || 3600,
    refresh_token: tokenEndpointResponse.refresh_token,
    id_token: tokenEndpointResponse.id_token,
  };
}
