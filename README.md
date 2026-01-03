# OIDC Node Web

A Node.js web service built with Next.js, React, and TypeScript that integrates with Aliyun OIDC (OpenID Connect) for authentication.

## Features

- 🔐 **Aliyun OIDC Integration**: Secure authentication using Aliyun's OpenID Connect service
- ⚛️ **Next.js 15**: Built with the latest Next.js App Router
- 🎯 **TypeScript**: Full type safety across the application
- 🎨 **Tailwind CSS**: Modern and responsive UI design
- 🔒 **Secure Sessions**: JWT-based session management with httpOnly cookies
- 🛡️ **Protected Routes**: Middleware-based route protection
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js 18.x or higher
- pnpm package manager
- Aliyun OIDC application credentials

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vanpipy/oidc-node-web.git
cd oidc-node-web
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

#### 3.1 For Mocking

Copy the example environment file and update it with your Aliyun OIDC credentials:

```bash
cp .env.example .env
```

#### 3.2 For Aliyun OIDC

Copy the example environment file and update it with your Aliyun OIDC credentials:

```bash
cp .env.test .env
```

**Important**: Generate a secure random string for `NEXTAUTH_SECRET`. You can use:

```bash
openssl rand -base64 32
```

### 4. Run the development server

#### 4.1 For Mocking

```bash
# run first when mocking
npm run mock:op
npm run dev:https
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 4.2 For Aliyun OIDC

```bash
npm run dev:https:domain
```

Open [https://local.oidc-node.com](https://local.oidc-node.com) in your browser.

### 5. Build for production

```bash
npm run build & npm start
```

## Project Structure

```
oidc-node-web/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Protected dashboard page
│   │   ├── products/          # Protected products page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Route protection middleware
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json              # Project dependencies
```

## How It Works

### Authentication Flow

1. **Login**: User clicks "Sign in with OIDC" on the home page
2. **Authorization**: User is redirected to Aliyun OIDC authorization endpoint
3. **Callback**: After successful authentication, Aliyun redirects back with an authorization code
4. **Token Exchange**: The application exchanges the code for access and ID tokens
5. **Session Creation**: A secure session is created and stored in an httpOnly cookie
6. **Protected Access**: User can now access protected routes like the dashboard

### Session Management

- Sessions are stored as JWT tokens in httpOnly cookies
- Tokens are signed with the `NEXTAUTH_SECRET`
- Sessions include user information and access tokens
- Automatic expiration based on token lifetime

### Route Protection

The middleware automatically protects routes defined in the `protectedRoutes` array. Unauthenticated users are redirected to the login page.

## Configuration

### Aliyun OIDC Setup

To use this application with Aliyun OIDC:

1. Create an OIDC application in your Aliyun account
2. Configure the redirect URI to match your application (e.g., `http://localhost:3000/api/auth/callback`)
3. Note down the issuer URL, client ID, and client secret
4. Update the `.env` file with these credentials

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OIDC_ISSUER` | Aliyun OIDC issuer URL | Yes |
| `OIDC_CLIENT_ID` | Client ID from Aliyun | Yes |
| `OIDC_CLIENT_SECRET` | Client secret from Aliyun | Yes |
| `OIDC_REDIRECT_URI` | Callback URL for OAuth flow | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |
| `NEXTAUTH_SECRET` | Secret key for signing sessions | Yes |

## API Endpoints

### Authentication Endpoints

- `GET /api/auth/login` - Initiates the OIDC login flow
- `GET /api/auth/callback` - Handles the OAuth callback
- `GET /api/auth/logout` - Logs out the user and clears the session
- `POST /api/auth/logout` - Alternative logout endpoint for API calls

## Security Considerations

- All sessions are stored in httpOnly cookies to prevent XSS attacks
- PKCE (Proof Key for Code Exchange) is used for additional security
- State parameter is validated to prevent CSRF attacks
- Sessions are signed with JWT and verified on each request
- Sensitive data is never exposed to the client

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### "Missing required OIDC configuration" error

Make sure all required environment variables are set in your `.env` file.

### "Failed to initialize OIDC client" error

Check that your `OIDC_ISSUER` URL is correct and accessible. The application needs to fetch the OIDC discovery document from this URL.

### Redirect URI mismatch

Ensure that the `OIDC_REDIRECT_URI` in your `.env` file matches exactly what you configured in your Aliyun OIDC application.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
