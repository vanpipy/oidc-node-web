import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import * as oauth from 'openid-client';
import { getAuthorizationUrl, exchangeCodeForTokens } from './oidc';
import { signIdToken } from '../../mocks/oidc-keys';

// Mock openid-client
vi.mock('openid-client', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('openid-client')>();
  return {
    ...actual,
    discovery: vi.fn(),
    authorizationCodeGrant: vi.fn(),
    randomPKCECodeVerifier: vi.fn(() => 'mock-verifier'),
    calculatePKCECodeChallenge: vi.fn(() => 'mock-challenge'),
    randomState: vi.fn(() => 'mock-state'),
  };
});

describe('OIDC Library', () => {
  beforeAll(() => {
    vi.stubEnv('OIDC_ISSUER', 'http://localhost:4000');
    vi.stubEnv('OIDC_CLIENT_ID', 'mock-client-id');
    vi.stubEnv('OIDC_CLIENT_SECRET', 'mock-client-secret');
    vi.stubEnv('OIDC_REDIRECT_URI', 'http://localhost:3000/api/auth/callback');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('should generate a valid authorization URL', async () => {
    // Mock the discovery call
    vi.mocked(oauth.discovery).mockResolvedValue({
      serverMetadata: () => ({
        authorization_endpoint: 'http://localhost:4000/authorize',
      }),
    } as any);

    const { url, codeVerifier, state } = await getAuthorizationUrl();

    expect(url).toContain('http://localhost:4000/authorize');
    expect(url).toContain('client_id=mock-client-id');
    expect(url).toContain('scope=openid+profile+email');
    expect(codeVerifier).toBe('mock-verifier');
    expect(state).toBe('mock-state');
  });

  it('should exchange code for tokens', async () => {
    // Mock the discovery call
    vi.mocked(oauth.discovery).mockResolvedValue({
      serverMetadata: () => ({
        token_endpoint: 'http://localhost:4000/token',
      }),
    } as any);

    // Create a valid ID token using our shared mock helper
    const idToken = await signIdToken({
      sub: 'mock-user-123',
      name: 'Test User',
      email: 'test@example.com',
      aud: 'mock-client-id',
      iss: 'http://localhost:4000',
    });

    // Mock the authorizationCodeGrant call
    vi.mocked(oauth.authorizationCodeGrant).mockResolvedValue({
      access_token: 'mock-access-token',
      id_token: idToken,
      expires_in: 3600,
    } as any);

    const tokens = await exchangeCodeForTokens('mock-code', 'mock-verifier');

    expect(tokens).toBeDefined();
    expect(tokens.access_token).toBe('mock-access-token');
    expect(tokens.id_token).toBe(idToken);
  });
});
