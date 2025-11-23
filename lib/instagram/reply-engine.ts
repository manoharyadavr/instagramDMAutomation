import { prisma } from '@/lib/prisma';
import { InstagramClient } from '@/lib/instagram/graph';
import { dmQueue } from '@/lib/queue';
import { quotaManager } from '@/lib/razorpay/quota';

type LogStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

interface CommentEvent {
    id: string; // comment ID
    text: string;
    from: {
        id: string;
        username: string;
    };
    media: {
        id: string;
    };
}

export class ReplyEngine {
    async processComment(
        tenantId: number,
        instagramAccountId: string,
        accessToken: string,
        event: CommentEvent
    ) {
        try {
            // 0. Check quota
            const canAutomate = await quotaManager.canAutomation(tenantId);
            if (!canAutomate) {
                console.warn(`Tenant ${tenantId} has exceeded automation quota`);
                await this.logReply(tenantId, event, 'SKIPPED', 'Automation quota exceeded');
                return;
            }

            // 1. Get Instagram Account config
            const igAccount = await prisma.instagramAccount.findUnique({
                where: { instagramId: instagramAccountId },
            });

            if (!igAccount || !igAccount.enableAutoReply) {
                console.log(`Auto-reply disabled for account ${instagramAccountId}`);
                return;
            }

            // 2. Get Reply Template
            const replyTemplate = await prisma.template.findFirst({
                where: {
                    tenantId,
                    id: igAccount.replyTemplateId || undefined,
                    type: 'REPLY',
                },
                orderBy: {
                    isDefault: 'desc', // Prefer default if no specific template set
                },
            });

            if (!replyTemplate) {
                console.warn(`No reply template found for tenant ${tenantId}`);
                await this.logReply(tenantId, event, 'FAILED', 'No reply template configured');
                return;
            }

            // 3. Prepare reply text (with variable substitution)
            const replyText = this.replaceVariables(replyTemplate.content, {
                username: event.from.username,
                comment: event.text,
            });

            // 4. Post Reply using Instagram Graph API
            const client = new InstagramClient({
                accessToken,
                instagramId: instagramAccountId,
            });

            try {
                await client.replyToComment(event.id, replyText);

                // 5. Log Success
                await this.logReply(tenantId, event, 'SUCCESS', null, replyText);

                // 6. Queue DM Task (if DM template configured)
                if (igAccount.dmTemplateId) {
                    await this.queueDM(tenantId, event.from.id, event.from.username, igAccount.dmTemplateId);
                }

                // 7. Log Automation Event
                await prisma.automationLog.create({
                    data: {
                        tenantId,
                        action: 'COMMENT_REPLY',
                        details: `Replied to comment ${event.id} from @${event.from.username}`,
                        status: 'SUCCESS',
                    },
                });

            } catch (error: any) {
                console.error('Error posting reply:', error);
                await this.logReply(tenantId, event, 'FAILED', error.message);
            }

        } catch (error: any) {
            console.error('Error in processComment:', error);
        }
    }

    private async logReply(
        tenantId: number,
        event: CommentEvent,
        status: LogStatus,
        error: string | null,
        replyText?: string
    ) {
        await prisma.replyLog.create({
            data: {
                tenantId,
                commentId: event.id,
                mediaId: event.media.id,
                username: event.from.username,
                replyText: replyText || '',
                status,
                error,
            },
        });
    }

    private async queueDM(
        tenantId: number,
        recipientId: string,
        username: string,
        dmTemplateId: number
    ) {
        await dmQueue.add('send-dm', {
            tenantId,
            recipientId,
            username,
            dmTemplateId,
        });
    }

    private replaceVariables(text: string, vars: Record<string, string>): string {
        let result = text;
        for (const [key, value] of Object.entries(vars)) {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return result;
    }
}
