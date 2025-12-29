import { exportJWK, generateKeyPair, SignJWT } from 'jose';

// Hardcoded keys for development consistency
const ALG = 'RS256';

// Singleton to hold the key pair
let keyPair: { privateKey: any; publicKey: any } | null = null;

async function getKeyPair() {
  if (!keyPair) {
    keyPair = await generateKeyPair(ALG);
  }
  return keyPair;
}

export async function getJWKS() {
  const { publicKey } = await getKeyPair();
  const jwk = await exportJWK(publicKey);
  
  // Add kid to the JWK
  jwk.kid = 'mock-oidc-key-1';
  jwk.alg = ALG;
  jwk.use = 'sig';
  
  return {
    keys: [jwk],
  };
}

export async function signIdToken(payload: any) {
  const { privateKey } = await getKeyPair();
  
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG, kid: 'mock-oidc-key-1' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);
    
  return jwt;
}
