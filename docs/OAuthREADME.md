## OAuth user Authentication with Auth.js

## Setup

### 1. Change .env.local to include the following:

```typescript
NEXTAUTH_SECRET=""
GITHUB_APP_CLIENT_ID=""
GITHUB_APP_CLIENT_SECRET=""
GOOGLE_ID=
GOOGLE_SECRET=
```
### 2. Follow these tutorials to generate the proper Id(s) and secret(s):
- To obtain the GOOGLE_ID and GOOGLE_SECRET, follow the tutorial linked here: https://developers.google.com/identity/protocols/oauth2
- To obtain the GITHUB_APP_CLIENT_ID and the GITHUB_APP_CLIENT_SECRET, follow the tutorial linked here: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

### 3. Run following in shell to receive NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Copy the output into NEXTAUTH_SECRET

### 5. Contact Administrator to generate new client secret for Google and GitHub
