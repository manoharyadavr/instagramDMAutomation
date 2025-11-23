import { Worker } from 'bullmq';
import { DMEngine } from '@/lib/instagram/dm-engine';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
};

const dmEngine = new DMEngine();

export const dmWorker = new Worker(
    'dm-queue',
    async (job) => {
        const data = job.data;

        // Process DM sending
        await dmEngine.sendDM(data);
    },
    {
        connection,
        concurrency: 3, // Process up to 3 DMs concurrently
        limiter: {
            max: 20, // Max 20 DMs per duration per worker
            duration: 60000, // 1 minute (60000ms)
            // This ensures we don't exceed Instagram's rate limits
            // Note: This is per worker instance. If you have multiple workers,
            // you may need a shared rate limiter using Redis (BullMQ Pro feature)
            // or implement a custom Redis-based rate limiter
        },
    }
);

dmWorker.on('completed', (job) => {
    console.log(`DM Job ${job.id} completed successfully`);
});

dmWorker.on('failed', (job, err) => {
    console.error(`DM Job ${job?.id} failed:`, err.message);
    // Job will be retried automatically based on queue config (3 attempts with exponential backoff)
});

dmWorker.on('error', (err) => {
    console.error('DM Worker error:', err);
});

console.log('DM Worker started - Rate limit: 20 DMs/minute');
