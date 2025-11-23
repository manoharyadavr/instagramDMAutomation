# 🚀 Redis Quick Start - Upstash Integration

## ✅ What Was Updated

1. **Added `@upstash/redis` package** - For REST API operations
2. **Updated `lib/redis/index.ts`** - Now supports both Upstash REST API and ioredis
3. **Updated `lib/queue/index.ts`** - Uses new Redis connection for BullMQ
4. **Updated all workers** - Now use `getRedisConnection()` function
5. **Created test route** - `/api/test-redis` to verify connection
6. **Updated `.env`** - Added Upstash credentials

## 🔑 Required Environment Variables

### For Vercel Production:

```env
# Upstash REST API (for simple operations)
UPSTASH_REDIS_URL=https://arriving-wallaby-38849.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token-here

# Redis Protocol (for BullMQ queues)
REDIS_URL=redis://default:password@arriving-wallaby-38849.upstash.io:6379
```

## ✅ Quick Test

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update `.env` with your Upstash credentials**

3. **Test locally:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/test-redis
   ```

4. **Deploy to Vercel:**
   - Add environment variables in Vercel dashboard
   - Push code → Auto-deploys
   - Test: `https://your-domain.vercel.app/api/test-redis`

## 📚 Usage

### Simple Operations (Upstash REST API)
```typescript
import { upstashRedis } from '@/lib/redis';

await upstashRedis.set('key', 'value');
const value = await upstashRedis.get('key');
```

### Background Jobs (BullMQ)
```typescript
import { dmQueue } from '@/lib/queue';

await dmQueue.add('send-dm', { ... });
```

## 🎯 Next Steps

1. ✅ Get your Upstash REST token from dashboard
2. ✅ Get your Upstash Redis URL (protocol endpoint)
3. ✅ Update `.env` file
4. ✅ Test connection: `/api/test-redis`
5. ✅ Deploy to Vercel with env vars
6. ✅ Monitor usage in Upstash dashboard

## 📖 Full Documentation

See `docs/UPSTASH_REDIS_SETUP.md` for complete setup guide.

