import { Queue } from 'bullmq';
import { getRedisConnection } from '@/lib/redis';

/**
 * BullMQ Queues for Background Jobs
 * 
 * These queues require a Redis connection with pub/sub support.
 * For Upstash, use the REDIS_URL (Redis protocol endpoint, not REST API).
 * 
 * Format: redis://default:password@host:port
 * Get this from Upstash dashboard → Redis → Connect → Redis URL
 */

// Get Redis connection for BullMQ
const redisConnection = getRedisConnection();

export const dmQueue = new Queue('dm-queue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    },
});

export const webhookQueue = new Queue('webhook-queue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 1000, // Keep last 1000 completed jobs
        },
    },
});
