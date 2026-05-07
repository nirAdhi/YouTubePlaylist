# VidVault Security Hardening Guide

## Critical: Run These Steps Immediately

### 1. Verify No Sensitive Files Are in Git

```bash
# Check what .env files are tracked by git
git ls-files | grep -E "\.env"

# If any .env files show up (except .env.example), remove them:
git rm --cached <file>
git commit -m "security: remove exposed env file from git"
git push

# Then add them to .gitignore (should already be there)
```

### 2. Server Firewall (UFW)

Block ALL ports except 80, 443, and SSH:

```bash
# Check current status
sudo ufw status verbose

# Reset and configure
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow only these ports
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Explicitly deny these (if they were previously open)
sudo ufw deny 3000/tcp comment 'Frontend direct'
sudo ufw deny 5000/tcp comment 'Backend API direct'
sudo ufw deny 5432/tcp comment 'PostgreSQL'
sudo ufw deny 6379/tcp comment 'Redis'

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status verbose
```

### 3. Verify No Direct Port Exposure

From an EXTERNAL machine (NOT your server), test these:

```bash
# These should ALL timeout or be refused:
curl -v --connect-timeout 5 http://46.224.110.185:3000
curl -v --connect-timeout 5 http://46.224.110.185:5000
curl -v --connect-timeout 5 telnet://46.224.110.185:5432
curl -v --connect-timeout 5 telnet://46.224.110.185:6379

# These should work:
curl -v --connect-timeout 5 https://tube.prasanit.org
```

### 4. Docker Network Verification

On your server, verify no ports are exposed:

```bash
# Check published ports (should only see 127.0.0.1:3000)
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Check netstat for listening ports
sudo ss -tlnp | grep -E "3000|5000|5432|6379"

# Should see:
# - 127.0.0.1:3000 (frontend, localhost only)
# - NOTHING on 0.0.0.0:5432 (PostgreSQL internal only)
# - NOTHING on 0.0.0.0:6379 (Redis internal only)
# - NOTHING on 0.0.0.0:5000 (backend internal only)
```

### 5. Environment Variables Security

```bash
# Generate STRONG passwords (do this ONCE, save them securely)
NEW_DB_PASS=$(openssl rand -base64 32)
NEW_JWT=$(openssl rand -base64 48)
NEW_REDIS=$(openssl rand -base64 32)

echo "Database Password: $NEW_DB_PASS"
echo "JWT Secret: $NEW_JWT"
echo "Redis Password: $NEW_REDIS"

# Create .env file
cat > .env << EOF
POSTGRES_USER=vidvault_admin
POSTGRES_PASSWORD=$NEW_DB_PASS
POSTGRES_DB=vidvault
DATABASE_URL=postgresql://vidvault_admin:$NEW_DB_PASS@db:5432/vidvault
JWT_SECRET=$NEW_JWT
REDIS_PASSWORD=$NEW_REDIS
REDIS_URL=redis://:$NEW_REDIS@redis:6379
NEXT_PUBLIC_API_URL=https://tube.prasanit.org/api
EOF

# Make sure .env is NEVER committed
cat .gitignore | grep "\.env"
```

### 6. Nginx Proxy Manager Configuration

Ensure Nginx Proxy Manager is the ONLY entry point:

```
Public Internet → Nginx Proxy Manager (80/443)
                           ↓
                  127.0.0.1:3000 (VidVault Frontend)
                           ↓
                  Internal Docker Network → Backend (5000)
                           ↓
                  Internal Docker Network → PostgreSQL (5432)
                  Internal Docker Network → Redis (6379)
```

**Proxy Host settings in Nginx Proxy Manager:**
- Domain: `tube.prasanit.org`
- Forward Hostname/IP: `127.0.0.1`
- Forward Port: `3000`
- Scheme: `http`
- Block Common Exploits: ✅ ON
- Websockets Support: ✅ ON

### 7. Regular Security Checks

Run monthly:

```bash
# Check for exposed ports from outside
nmap -p 3000,5000,5432,6379 46.224.110.185

# Check Docker containers
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Check for updates
docker-compose pull
docker-compose up -d

# Review logs for suspicious activity
docker-compose logs backend | grep -i "error\|unauthorized\|cors"
```

## Security Features Already Implemented

| Feature | Status |
|---------|--------|
| Redis password authentication | ✅ |
| PostgreSQL no external exposure | ✅ |
| Backend API no external exposure | ✅ |
| Frontend binds to localhost only | ✅ |
| Non-root container users | ✅ |
| Helmet security headers | ✅ |
| Rate limiting | ✅ |
| CORS origin restriction | ✅ |
| Password hashing (bcrypt) | ✅ |
| JWT token expiration | ✅ |
| Request body size limit | ✅ |
| no-new-privileges | ✅ |

## Incident Response

If you receive another CERT notification:

1. **Immediately check exposed ports:**
   ```bash
   sudo ss -tlnp | grep -E "0.0.0.0:(5432|6379|5000|3000)"
   ```

2. **If Redis/PostgreSQL are on 0.0.0.0:**
   ```bash
   docker-compose down
   # Fix docker-compose.yml (ensure no 'ports:' for db/redis)
   docker-compose up -d
   ```

3. **Check firewall:**
   ```bash
   sudo ufw status
   ```

4. **Verify from external:**
   ```bash
   # From your local machine:
   nmap -p 6379,5432,5000,3000 YOUR_SERVER_IP
   ```
