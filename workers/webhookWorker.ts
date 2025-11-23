/**
 * Webhook Worker
 * NOTE: This functionality is now handled by replyWorker.ts
 * This file is kept for reference/compatibility but the actual
 * webhook processing happens in workers/replyWorker.ts
 */

import { Worker } from 'bullmq';
import { ReplyEngine } from '@/lib/instagram/reply-engine';
import { prisma } from '@/lib/prisma';
import { getRedisConnection } from '@/lib/redis';

const replyEngine = new ReplyEngine();

export const webhookWorker = new Worker(
    'webhook-queue',
    async (job) => {
        const { tenantId, instagramAccountId, accessToken, event } = job.data;

        try {
            // Process different event types
            if (event.field === 'comments') {
                await replyEngine.processComment(
                    tenantId,
                    instagramAccountId,
                    accessToken,
                    event.value
                );
            }

            // Mark webhook event as processed in DB if we have the event ID
            // We need to find the event by payload match
            await prisma.webhookEvent.updateMany({
                where: {
                    tenantId,
                    type: event.field,
                    processed: false,
                },
                data: {
                    processed: true,
                },
            });

            // Can handle other event types here:
            // - mentions
            // - story_replies
            // - etc.
        } catch (error: any) {
            console.error('Webhook processing error:', error);
            throw error; // Re-throw to trigger retry
        }
    },
    {
        connection: getRedisConnection(),
        concurrency: 5,
        limiter: {
            max: 20,
            duration: 60000,
        },
    }
);

webhookWorker.on('completed', (job) => {
    console.log(`Webhook Job ${job.id} completed`);
});

webhookWorker.on('failed', (job, err) => {
    console.error(`Webhook Job ${job?.id} failed:`, err);
});

console.log('Webhook Worker started');
