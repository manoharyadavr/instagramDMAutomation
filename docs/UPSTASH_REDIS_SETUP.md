# ✅ Upstash Redis Setup Guide

This guide explains how to set up and use Upstash Redis with your Instagram Automation SaaS.

## 📋 Overview

We use **two Redis clients** for different purposes:

1. **Upstash REST API** (`@upstash/redis`) - For simple operations, caching, rate limiting
2. **ioredis** - For BullMQ queues (requires pub/sub support)

## 🔧 Step 1: Get Your Upstash Credentials

1. Go to [Upstash Dashboard](https://console.upstash.com/)
2. Select your database: `arriving-wallaby-38849`
3. Copy the following:

### REST API Credentials (for simple operations)
- **UPSTASH_REDIS_URL**: `https://arriving-wallaby-38849.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: Copy from "REST API" section

### Redis Protocol URL (for BullMQ)
- Go to "Connect" tab
- Copy the **Redis URL** (format: `redis://default:password@host:port`)
- This is your `REDIS_URL`

## 🔧 Step 2: Update Environment Variables

### Local Development (`.env`)

```env
# Upstash REST API
UPSTASH_REDIS_URL="https://arriving-wallaby-38849.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-rest-token-here"

# Redis Protocol (for BullMQ)
# Use localhost for development, or Upstash Redis URL for production
REDIS_URL="redis://localhost:6379"
# OR use Upstash:
# REDIS_URL="redis://default:password@arriving-wallaby-38849.upstash.io:6379"
```

### Vercel Production

Add these in **Vercel → Project → Settings → Environment Variables**:

```env
UPSTASH_REDIS_URL=https://arriving-wallaby-38849.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token-here
REDIS_URL=redis://default:password@arriving-wallaby-38849.upstash.io:6379
```

## ✅ Step 3: Install Dependencies

```bash
npm install @upstash/redis
```

## ✅ Step 4: Test Redis Connection

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/test-redis`
3. Expected response:
   ```json
   {
     "success": true,
     "message": "Redis connection successful! ✅",
     "tests": {
       "setGet": "maniora",
       "counter": 1,
       "listLength": 3,
       "hashValue": "value1"
     }
   }
   ```

## 📚 Usage Examples

### Using Upstash REST API (Simple Operations)

```typescript
import { upstashRedis } from '@/lib/redis';

// Set/Get
await upstashRedis.set('key', 'value');
const value = await upstashRedis.get('key');

// Rate limiting
await upstashRedis.incr(`rate_limit:${userId}`);
await upstashRedis.expire(`rate_limit:${userId}`, 60);

// Caching
await upstashRedis.set('cache:key', JSON.stringify(data), { ex: 3600 });
const cached = await upstashRedis.get('cache:key');

// Lists
await upstashRedis.lpush('events', JSON.stringify(event));
const events = await upstashRedis.lrange('events', 0, -1);
```

### Using BullMQ Queues (Background Jobs)

```typescript
import { dmQueue, webhookQueue } from '@/lib/queue';

// Add job to queue
await dmQueue.add('send-dm', {
    tenantId: 1,
    recipientId: 'user123',
    message: 'Hello!',
});

// Process jobs (in workers)
// See workers/dmWorker.ts and workers/webhookWorker.ts
```

## 🎯 Use Cases in This Application

### 1. Webhook Event Processing
- **Location**: `app/api/webhooks/instagram/route.ts`
- **Usage**: Queues Instagram webhook events for processing
- **Queue**: `webhookQueue`

### 2. DM Sending
- **Location**: `lib/instagram/reply-engine.ts`
- **Usage**: Queues DM sending after auto-reply
- **Queue**: `dmQueue`

### 3. Rate Limiting (Future)
- Track API calls per user/account
- Prevent abuse
- Monitor usage

### 4. Caching (Future)
- Cache Instagram account data
- Cache analytics
- Cache template responses

## 🔍 Monitoring

1. Go to [Upstash Dashboard](https://console.upstash.com/)
2. Select your database
3. View **Monitor** tab:
   - Commands count
   - Storage usage
   - Bandwidth
   - Cost

## 💰 Free Tier Limits

- **10,000 commands/day** ✅
- **256 MB storage** ✅
- **Perfect for MVP** ✅

## 🚨 Troubleshooting

### Error: "UPSTASH_REDIS_URL is not defined"
- Check `.env` file has `UPSTASH_REDIS_URL`
- Restart dev server after adding env vars
- In Vercel, ensure env vars are set in project settings

### Error: "REDIS_URL is not defined"
- BullMQ requires `REDIS_URL` for queues
- Use Upstash Redis protocol URL or localhost Redis

### BullMQ Not Working
- Ensure `REDIS_URL` uses Redis protocol (not REST API)
- Format: `redis://default:password@host:port`
- Check connection in Upstash dashboard

### Test Route Failing
- Verify `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Check Upstash dashboard for database status
- Ensure network can reach Upstash

## 📝 Next Steps

1. ✅ Test Redis connection
2. ✅ Deploy to Vercel with env vars
3. ✅ Test production Redis connection
4. ✅ Monitor usage in Upstash dashboard
5. ✅ Implement rate limiting
6. ✅ Add caching for performance

## 🔗 Resources

- [Upstash Documentation](https://docs.upstash.com/redis)
- [@upstash/redis SDK](https://github.com/upstash/upstash-redis)
- [BullMQ Documentation](https://docs.bullmq.io/)

