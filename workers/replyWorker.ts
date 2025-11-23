import { Worker } from 'bullmq';
import { ReplyEngine } from '@/lib/instagram/reply-engine';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
};

const replyEngine = new ReplyEngine();

export const replyWorker = new Worker(
    'webhook-queue',
    async (job) => {
        const { tenantId, instagramAccountId, accessToken, event } = job.data;

        // Check if this is a comment event
        if (event.field === 'comments') {
            const commentData = event.value;

            // Process the comment
            await replyEngine.processComment(
                tenantId,
                instagramAccountId,
                accessToken,
                commentData
            );
        }

        // Handle other event types if needed (mentions, story_replies, etc.)
        // For now, we focus on comments as per the requirements
    },
    {
        connection,
        concurrency: 5, // Process up to 5 jobs concurrently
        limiter: {
            max: 20, // Max 20 jobs per duration
            duration: 60000, // 1 minute
        },
    }
);

replyWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

replyWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

console.log('Reply Worker started');
