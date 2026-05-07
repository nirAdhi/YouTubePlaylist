# Authelia 2FA Setup Guide for VidVault

## Overview
This guide sets up Authelia to provide two-factor authentication (2FA) for VidVault using TOTP (Time-based One-Time Password) via authenticator apps like Google Authenticator, Authy, or Bitwarden.

## Prerequisites
- Docker and Docker Compose installed
- Nginx Proxy Manager already configured for VidVault
- Valid SSL certificates for your domain

## Step 1: Add Authelia Environment Variables

Add these to your `.env` file (generate strong secrets):

```bash
# Authelia secrets (generate with: openssl rand -base64 32)
AUTHELIA_JWT_SECRET=your-generated-secret
AUTHELIA_SESSION_SECRET=your-generated-secret
AUTHELIA_STORAGE_ENCRYPTION_KEY=your-generated-secret
AUTHELIA_LDAP_PASSWORD=your-ldap-admin-password
```

Generate secrets:
```bash
openssl rand -base64 32
```

## Step 2: Start Authelia Services

```bash
cd ~/youtubeApp/authelia
docker-compose -f docker-compose.authelia.yml up -d
```

## Step 3: Create Initial User

Generate a password hash:
```bash
docker run --rm authelia/authelia:latest authelia hash-password 'your-strong-password'
```

Edit `authelia/config/users_database.yml` and replace the password hash.

## Step 4: Configure Nginx Proxy Manager (NPM) for Forward Auth

In Nginx Proxy Manager, for the `tube.prasanit.org` proxy host:

### Custom Locations (Advanced Tab)

Add a new custom location for `/authelia`:
- **Location**: `/authelia`
- **Forward Hostname / IP**: `172.17.0.1` (or your Docker host IP)
- **Forward Port**: `9091`
- **Scheme**: `http`

### Advanced Tab (Custom Nginx Configuration)

Add this to the "Custom Nginx Configuration" section:

```nginx
# Authelia Forward Auth
location / {
    include /config/nginx/proxy.conf;
    include /config/nginx/resolver.conf;

    # Forward auth to Authelia
    auth_request /authelia/api/verify;
    auth_request_set $user $upstream_http_remote_user;
    auth_request_set $groups $upstream_http_remote_groups;
    auth_request_set $name $upstream_http_remote_name;
    auth_request_set $email $upstream_http_remote_email;

    proxy_set_header Remote-User $user;
    proxy_set_header Remote-Groups $groups;
    proxy_set_header Remote-Name $name;
    proxy_set_header Remote-Email $email;

    # Bypass auth for API health and auth endpoints
    location ~ ^/api/(health|auth/(login|register))$ {
        auth_request off;
        proxy_pass http://172.17.0.1:5005;
    }

    proxy_pass http://172.17.0.1:3003;
}

# Authelia verification endpoint
location = /authelia/api/verify {
    internal;
    proxy_pass http://172.17.0.1:9091/api/verify;
    proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
    proxy_set_header X-Original-Method $request_method;
    proxy_set_header X-Forwarded-Method $request_method;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $http_host;
    proxy_set_header Content-Length "";
    proxy_pass_request_body off;
}
```

**Note**: If using the Custom Locations UI instead of Advanced config, you need to:
1. Set the main proxy to forward to Authelia
2. Or use the NPM Access Lists feature with Authelia as the auth provider

## Step 5: Access Authelia Portal

Navigate to `https://tube.prasanit.org/authelia` to:
- Log in with your credentials
- Register your TOTP device (scan QR code with authenticator app)
- Manage 2FA settings

## Step 6: VidVault Integration (Optional)

If you want VidVault to know about the authenticated user from Authelia:

1. Update the backend to trust the `Remote-User` and `Remote-Email` headers from Authelia
2. Create a middleware that extracts this header and creates/looks up the user

Example backend middleware (`backend/src/middleware/authelia.js`):
```javascript
function autheliaAuth(req, res, next) {
  const email = req.headers['remote-email'];
  const user = req.headers['remote-user'];
  
  if (email && user) {
    req.autheliaUser = { email, username: user };
  }
  
  next();
}
```

## Troubleshooting

### Check Authelia logs
```bash
docker-compose -f authelia/docker-compose.authelia.yml logs -f authelia
```

### Verify Authelia health
```bash
curl http://127.0.0.1:9091/api/health
```

### Test user password hash
```bash
docker run --rm authelia/authelia:latest authelia hash-password --check '$argon2id$...' 'yourpassword'
```

## Security Notes

1. **Never expose Authelia directly to the internet** - always use NPM as reverse proxy
2. **Keep encryption keys secret** - rotate immediately if exposed
3. **Use strong passwords** for all Authelia accounts
4. **Enable SMTP** for production to send 2FA backup codes and notifications
5. **Backup `users_database.yml`** and `configuration.yml` regularly

## Architecture

```
Internet → Nginx Proxy Manager (443)
              ├── / → Authelia Verify → VidVault Frontend (3003)
              ├── /api → Authelia Verify → VidVault Backend (5005)
              └── /authelia → Authelia Portal (9091)
```

## Status

After setup:
- All users must authenticate via Authelia before accessing VidVault
- TOTP 2FA required after initial login
- API health/auth endpoints bypass 2FA for registration/login flow
- Session management handled by Authelia (Redis-backed)
