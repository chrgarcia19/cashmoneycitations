## OAuth user Authentication with Auth.js

## Setup

### 1. Change .env.local to include the following:

```typescript
NEXTAUTH_SECRET=""
GITHUB_APP_CLIENT_ID="4ac00bbeab28739df025"
GITHUB_APP_CLIENT_SECRET=""
```

### 2. Run following in shell to receive NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 3. Copy the output into NEXTAUTH_SECRET

### 4. Contact Administrator to generate new client secret
