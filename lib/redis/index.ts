import { Redis as UpstashRedis } from '@upstash/redis';
import Redis from 'ioredis';

/**
 * Upstash Redis Client (REST API)
 * Use this for simple key-value operations, caching, rate limiting
 * Works perfectly with Vercel serverless functions
 */
export const upstashRedis = new UpstashRedis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * ioredis Client (for BullMQ)
 * BullMQ requires a Redis connection with pub/sub support
 * Use REDIS_URL which should be the Redis protocol endpoint from Upstash
 */
let ioredisClient: Redis | null = null;

export const getRedisConnection = (): Redis => {
    if (ioredisClient) {
        return ioredisClient;
    }

    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
        throw new Error('REDIS_URL is not defined. Required for BullMQ queues.');
    }

    ioredisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null, // Required for BullMQ
        enableReadyCheck: true,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

    return ioredisClient;
};

/**
 * Legacy export for backward compatibility
 * Use upstashRedis for new code, or getRedisConnection() for BullMQ
 */
export const redis = upstashRedis;
