import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export interface AffiliateConfig {
    commissionRate: number; // Percentage (e.g., 30 for 30%)
    cookieDuration: number; // Days
    minPayoutAmount: number; // Minimum payout threshold in INR
}

export const AFFILIATE_CONFIG: AffiliateConfig = {
    commissionRate: 30, // 30% commission
    cookieDuration: 30, // 30-day cookie
    minPayoutAmount: 1000, // ₹1000 minimum payout
};

export class AffiliateManager {
    /**
     * Generate unique affiliate code for a user
     */
    async generateAffiliateCode(userId: number, name: string): Promise<string> {
        // Create a unique code based on user ID and random string
        const randomPart = crypto.randomBytes(4).toString('hex');
        const baseCode = name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 8);

        const code = `${baseCode}-${randomPart}`;

        // Ensure uniqueness
        const existing = await prisma.affiliate.findUnique({
            where: { code: code },
        });

        if (existing) {
            // Recursively try again with new random part
            return this.generateAffiliateCode(userId, name);
        }

        return code;
    }

    /**
     * Create or get affiliate record for a user
     */
    async enrollAffiliate(userId: number, tenantId: number): Promise<any> {
        // Check if already enrolled
        const existing = await prisma.affiliate.findUnique({
            where: { userId: userId },
        });

        if (existing) {
            return existing;
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Generate code
        const referralCode = await this.generateAffiliateCode(userId, user.name || 'user');

        // Create affiliate record
        const affiliate = await prisma.affiliate.create({
            data: {
                userId,
                tenantId,
                code: referralCode,
                referralCode,
                totalEarnings: 0,
                pendingPayout: 0,
                totalReferrals: 0,
            },
        });

        return affiliate;
    }

    /**
     * Track a referral (when someone clicks affiliate link)
     */
    async trackReferral(referralCode: string, metadata?: Record<string, any>): Promise<void> {
        const affiliate = await prisma.affiliate.findUnique({
            where: { referralCode: referralCode },
        });

        if (!affiliate) {
            throw new Error('Invalid referral code');
        }

        // Increment click count or store in a separate tracking table if needed
        // For now, we'll just validate the code
        console.log(`Tracked referral for code: ${referralCode}`, metadata);
    }

    /**
     * Track a conversion (when referred user subscribes)
     */
    async trackConversion(
        referralCode: string,
        subscriptionId: number,
        amount: number
    ): Promise<void> {
        const affiliate = await prisma.affiliate.findUnique({
            where: { referralCode: referralCode },
        });

        if (!affiliate) {
            throw new Error('Invalid referral code');
        }

        // Calculate commission
        const commission = (amount * AFFILIATE_CONFIG.commissionRate) / 100;

        // Update affiliate earnings
        await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: {
                totalEarnings: { increment: commission },
                pendingPayout: { increment: commission },
                totalReferrals: { increment: 1 },
            },
        });

        console.log(
            `Tracked conversion for ${referralCode}: ₹${amount} -> ₹${commission} commission`
        );
    }

    /**
     * Process payout for an affiliate
     */
    async processPayout(affiliateId: number, amount: number): Promise<void> {
        const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId },
        });

        if (!affiliate) {
            throw new Error('Affiliate not found');
        }

        if (affiliate.pendingPayout < amount) {
            throw new Error('Insufficient pending payout');
        }

        if (amount < AFFILIATE_CONFIG.minPayoutAmount) {
            throw new Error(`Minimum payout amount is ₹${AFFILIATE_CONFIG.minPayoutAmount}`);
        }

        // Update affiliate
        await prisma.affiliate.update({
            where: { id: affiliateId },
            data: {
                pendingPayout: { decrement: amount },
            },
        });

        console.log(`Processed payout of ₹${amount} for affiliate ${affiliateId}`);
    }

    /**
     * Get affiliate statistics
     */
    async getAffiliateStats(userId: number) {
        const affiliate = await prisma.affiliate.findUnique({
            where: { userId: userId },
        });

        if (!affiliate) {
            return null;
        }

        return {
            referralCode: affiliate.referralCode,
            totalEarnings: affiliate.totalEarnings,
            pendingPayout: affiliate.pendingPayout,
            totalReferrals: affiliate.totalReferrals,
            referralUrl: `${process.env.NEXTAUTH_URL}/signup?ref=${affiliate.referralCode}`,
        };
    }

    /**
     * Get top affiliates (leaderboard)
     */
    async getTopAffiliates(limit: number = 10) {
        return prisma.affiliate.findMany({
            take: limit,
            orderBy: { totalEarnings: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}

export const affiliateManager = new AffiliateManager();
