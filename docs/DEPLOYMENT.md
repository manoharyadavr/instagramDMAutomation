# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- MySQL 8.0+ (or use Docker)
- Redis (or use Docker)
- Node.js 20+ (for local development)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd instagramAutomation
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/instagram_automation"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Razorpay
RAZORPAY_KEY_ID="your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Instagram API
INSTAGRAM_APP_ID="your_app_id"
INSTAGRAM_APP_SECRET="your_app_secret"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/api/auth/instagram/callback"
```

### 3. Start Infrastructure Services

```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

This starts:
- MySQL on port 3306
- Redis on port 6379

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Start Workers (Separate Terminal)

```bash
npm run worker
```

Workers process background jobs (webhooks, DMs, etc.)

## Production Deployment

### Option 1: Docker Compose

1. **Build and Start Services**

```bash
docker-compose -f infra/docker-compose.prod.yml up -d
```

2. **Run Migrations**

```bash
docker-compose exec app npm run db:migrate
```

### Option 2: Manual Deployment

1. **Build Application**

```bash
npm run build
```

2. **Start Production Server**

```bash
npm start
```

3. **Start Workers**

```bash
npm run worker
```

### Environment Variables for Production

Ensure all production environment variables are set:
- Use strong `NEXTAUTH_SECRET`
- Configure production database URL
- Set production Instagram API credentials
- Configure SMTP for email notifications
- Set production Razorpay credentials

### Nginx Configuration

The `infra/nginx.conf` file is configured for production use. Update the `server_name` directive with your domain.

### SSL/TLS

For production, configure SSL certificates:
- Use Let's Encrypt with Certbot
- Update Nginx configuration to use HTTPS
- Update `NEXTAUTH_URL` to use HTTPS

## Instagram App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Basic Display or Instagram Graph API product
4. Configure OAuth redirect URI: `https://yourdomain.com/api/auth/instagram/callback`
5. Get App ID and App Secret
6. Configure webhook subscription (requires page access token)

## Razorpay Setup

1. Create account at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard → Settings → API Keys
3. Create subscription plans in Razorpay dashboard
4. Configure webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
5. Set webhook secret

## Monitoring

- Monitor worker logs for job processing
- Set up error tracking (e.g., Sentry)
- Monitor database performance
- Track API rate limits for Instagram API

## Backup

Regular backups should include:
- Database backups (MySQL)
- Environment variables
- Configuration files

## Scaling

See `SCALING.md` for horizontal scaling strategies.


