import express from 'express';
import https from 'https';
import selfsigned from 'selfsigned';
import { getJWKS, signIdToken } from './oidc-keys';

const app = express();
const PORT = 4000;
const ISSUER = `https://localhost:${PORT}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Discovery Endpoint
app.get('/.well-known/openid-configuration', (req, res) => {
  res.json({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/authorize`,
    token_endpoint: `${ISSUER}/token`,
    userinfo_endpoint: `${ISSUER}/userinfo`,
    jwks_uri: `${ISSUER}/jwks`,
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
    claims_supported: ['sub', 'name', 'email', 'picture'],
  });
});

// JWKS Endpoint
app.get('/jwks', async (req, res) => {
  const jwks = await getJWKS();
  res.json(jwks);
});

// Authorize Endpoint
app.get('/authorize', (req, res) => {
  const { redirect_uri, state } = req.query;
  
  if (!redirect_uri || !state) {
    res.status(400).send('Missing redirect_uri or state');
    return;
  }

  const callbackUrl = new URL(redirect_uri as string);
  callbackUrl.searchParams.set('code', 'mock-auth-code-123');
  callbackUrl.searchParams.set('state', state as string);
  
  res.redirect(callbackUrl.toString());
});

// Token Endpoint
app.post('/token', async (req, res) => {
  const idTokenPayload = {
    iss: ISSUER,
    sub: 'mock-user-123',
    aud: 'mock-client-id', // Match what is in .env
    name: 'Mock User',
    email: 'mockuser@example.com',
    picture: 'https://ui-avatars.com/api/?name=Mock+User',
    email_verified: true,
  };
  
  const idToken = await signIdToken(idTokenPayload);
  
  res.json({
    access_token: 'mock-access-token-xyz',
    token_type: 'Bearer',
    expires_in: 3600,
    id_token: idToken,
  });
});

// UserInfo Endpoint
app.get('/userinfo', (req, res) => {
  res.json({
    sub: 'mock-user-123',
    name: 'Mock User',
    email: 'mockuser@example.com',
    picture: 'https://ui-avatars.com/api/?name=Mock+User',
    email_verified: true,
  });
});

// Generate self-signed certificate
(async () => {
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  try {
    const pems = await selfsigned.generate(attrs);
    console.log('Certificate generated successfully.');

    https.createServer({
      key: pems.private,
      cert: pems.cert
    }, app).listen(PORT, () => {
      console.log(`Mock OIDC Provider running at ${ISSUER}`);
    });
  } catch (err) {
    console.error('Failed to generate certificate:', err);
  }
})();
