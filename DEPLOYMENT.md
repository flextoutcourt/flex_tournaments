# Deployment Guide - Flex Tournaments

## Environment Variables Configuration

For your production deployment on `tournaments.flex-central.com`, you need to set the following environment variables:

### Required Variables

```bash
# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# Authentication Secrets
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key"
AUTH_SECRET="your-generated-secret-key"

# Production URLs
NEXTAUTH_URL="https://tournaments.flex-central.com"
AUTH_URL="https://tournaments.flex-central.com"

# Trust Host (REQUIRED for production)
AUTH_TRUST_HOST="true"

# Node Environment
NODE_ENV="production"
```

### Optional Variables

```bash
# YouTube API (for video search)
YOUTUBE_API_KEY="your-youtube-api-key"
```

## Fixing the UntrustedHost Error

The error you're seeing is because NextAuth v5 requires explicit host trust configuration. The fix is already applied in the code with `trustHost: true` in `src/lib/auth.ts`.

**On your production server**, make sure your `.env` file includes:

```bash
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://tournaments.flex-central.com"
AUTH_URL="https://tournaments.flex-central.com"
```

## Deployment Steps

1. **Set Environment Variables** on your production server:
   ```bash
   cd /home/ubuntu/apps/flex-tournaments
   nano .env
   ```

2. **Add/Update the following in your .env file:**
   ```bash
   AUTH_TRUST_HOST=true
   NEXTAUTH_URL=https://tournaments.flex-central.com
   AUTH_URL=https://tournaments.flex-central.com
   NEXTAUTH_SECRET=your-secret-key
   AUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   NODE_ENV=production
   ```

3. **Rebuild the application:**
   ```bash
   npm run build
   ```

4. **Restart PM2:**
   ```bash
   pm2 restart tournaments
   pm2 save
   ```

5. **Check logs:**
   ```bash
   pm2 logs tournaments --lines 50
   ```

## PM2 Configuration

If you need to configure PM2, create an `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'tournaments',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/apps/flex-tournaments',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Then restart with:
```bash
pm2 reload ecosystem.config.js
```

## Nginx Configuration

Make sure your Nginx reverse proxy is correctly configured:

```nginx
server {
    listen 80;
    server_name tournaments.flex-central.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tournaments.flex-central.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

Make sure database migrations are run:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Troubleshooting

### UntrustedHost Error
- Ensure `AUTH_TRUST_HOST=true` is set
- Verify `NEXTAUTH_URL` and `AUTH_URL` match your domain
- Check that the domain in the URL matches your server configuration

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from the server
- Ensure Prisma migrations are up to date

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Rebuild: `npm run build`

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Database migrations are applied
- [ ] Application builds successfully
- [ ] PM2 is running the application
- [ ] Nginx is proxying correctly
- [ ] SSL certificate is valid
- [ ] Can access the site via HTTPS
- [ ] Authentication works
- [ ] Can create and view tournaments
