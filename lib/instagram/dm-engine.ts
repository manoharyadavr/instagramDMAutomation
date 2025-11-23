import { prisma } from '@/lib/prisma';
import { InstagramClient } from '@/lib/instagram/graph';

interface DMJobData {
    tenantId: number;
    recipientId: string; // Instagram scoped user ID
    username: string;
    dmTemplateId: number;
    instagramAccountId?: string;
    accessToken?: string;
}

export class DMEngine {
    async sendDM(data: DMJobData) {
        const { tenantId, recipientId, username, dmTemplateId } = data;

        try {
            // 1. Get DM Template
            const template = await prisma.template.findFirst({
                where: {
                    tenantId,
                    id: dmTemplateId,
                    type: 'DM',
                },
            });

            if (!template) {
                throw new Error(`DM template ${dmTemplateId} not found`);
            }

            // 2. Get Instagram Account (if not provided in job data)
            let accessToken = data.accessToken;
            let instagramId = data.instagramAccountId;

            if (!accessToken || !instagramId) {
                const account = await prisma.instagramAccount.findFirst({
                    where: { tenantId },
                    orderBy: { connectedAt: 'desc' }, // Use most recent
                });

                if (!account) {
                    throw new Error('No Instagram account connected');
                }

                accessToken = account.accessToken;
                instagramId = account.instagramId;
            }

            // 3. Replace template variables
            const messageText = this.replaceVariables(template.content, {
                username,
                recipient_id: recipientId,
            });

            // 4. Send DM via Instagram API
            if (!accessToken || !instagramId) {
                throw new Error('Instagram credentials not available');
            }

            const client = new InstagramClient({
                accessToken,
                instagramId,
            });

            await client.sendDM(recipientId, messageText);

            // 5. Log Success
            await this.logDM(tenantId, username, messageText, 'SUCCESS', null);

            // 6. Log automation event
            await prisma.automationLog.create({
                data: {
                    tenantId,
                    action: 'SEND_DM',
                    details: `Sent DM to @${username}`,
                    status: 'SUCCESS',
                },
            });

            return { success: true };

        } catch (error: any) {
            console.error('Error sending DM:', error);

            // Log failure
            await this.logDM(tenantId, username, '', 'FAILED', error.message);

            // Rethrow to trigger BullMQ retry
            throw error;
        }
    }

    private async logDM(
        tenantId: number,
        username: string,
        messageText: string,
        status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED',
        error: string | null
    ) {
        await prisma.dMLog.create({
            data: {
                tenantId,
                username,
                messageText,
                status,
                error,
            },
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
