export interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenSet {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

export interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  [key: string]: unknown;
}

export interface SessionData {
  user: UserInfo;
  accessToken: string;
  idToken?: string;
  expiresAt: number;
  [key: string]: unknown;
}
