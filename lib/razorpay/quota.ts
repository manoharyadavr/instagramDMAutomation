import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS } from '@/lib/razorpay/plans';

export interface UsageQuota {
    automations: {
        used: number;
        limit: number;
        remaining: number;
    };
    accounts: {
        used: number;
        limit: number;
        remaining: number;
    };
    templates: {
        used: number;
        limit: number;
        remaining: number;
    };
}

export class QuotaManager {
    /**
     * Get current usage and limits for a tenant
     */
    async getUsage(tenantId: number): Promise<UsageQuota> {
        // Get active subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                tenantId,
                status: { in: ['ACTIVE', 'TRIALING'] },
            },
        });

        // Default limits if no subscription (free tier or grace period)
        let limits = {
            automations: 100,
            accounts: 1,
            templates: 3,
        };

        if (subscription) {
            const plan = SUBSCRIPTION_PLANS[subscription.planId];
            if (plan) {
                limits = plan.limits;
            }
        }

        // Get current month's automation count
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const automationCount = await prisma.automationLog.count({
            where: {
                tenantId,
                createdAt: { gte: startOfMonth },
            },
        });

        // Get account count
        const accountCount = await prisma.instagramAccount.count({
            where: { tenantId },
        });

        // Get template count
        const templateCount = await prisma.template.count({
            where: { tenantId },
        });

        return {
            automations: {
                used: automationCount,
                limit: limits.automations,
                remaining: Math.max(0, limits.automations - automationCount),
            },
            accounts: {
                used: accountCount,
                limit: limits.accounts,
                remaining: Math.max(0, limits.accounts - accountCount),
            },
            templates: {
                used: templateCount,
                limit: limits.templates === -1 ? -1 : limits.templates,
                remaining: limits.templates === -1 ? -1 : Math.max(0, limits.templates - templateCount),
            },
        };
    }

    /**
     * Check if tenant can perform an automation
     */
    async canAutomation(tenantId: number): Promise<boolean> {
        const usage = await this.getUsage(tenantId);
        return usage.automations.remaining > 0;
    }

    /**
     * Check if tenant can add more accounts
     */
    async canAddAccount(tenantId: number): Promise<boolean> {
        const usage = await this.getUsage(tenantId);
        return usage.accounts.remaining > 0;
    }

    /**
     * Check if tenant can add more templates
     */
    async canAddTemplate(tenantId: number): Promise<boolean> {
        const usage = await this.getUsage(tenantId);
        return usage.templates.limit === -1 || usage.templates.remaining > 0;
    }

    /**
     * Increment automation usage (called after successful automation)
     * This is already tracked via automationLog creation, so this is a no-op
     * but kept for explicit usage tracking if needed
     */
    async trackAutomation(tenantId: number): Promise<void> {
        // Already tracked via automationLog
        // This method can be extended for additional tracking if needed
    }
}

export const quotaManager = new QuotaManager();
