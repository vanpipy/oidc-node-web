// eslint-disable
import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';

// Generate self-signed certificate
(async () => {
  try {
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = await selfsigned.generate(attrs);

    const certsDir = path.join(process.cwd(), 'certs');

    if (!fs.existsSync(certsDir)) {
      fs.mkdirSync(certsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(certsDir, 'server.key'), pems.private);
    fs.writeFileSync(path.join(certsDir, 'server.crt'), pems.cert);

    console.log('Certificates generated successfully in certs/ directory');
  } catch (error) {
    console.error('Failed to generate certificates:', error);
    process.exit(1);
  }
})();
