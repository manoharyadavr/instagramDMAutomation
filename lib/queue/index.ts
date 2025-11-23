import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

// Reuse the ioredis connection from lib/redis if possible, 
// but BullMQ usually needs its own connection settings or instance.
// We'll pass the connection options.

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
};

export const dmQueue = new Queue('dm-queue', {
    connection,
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
    connection,
});
