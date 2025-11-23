import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { affiliateManager, AFFILIATE_CONFIG } from '@/lib/affiliate';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const tenant = await requireTenant();
        const body = await req.json();
        const { amount, paymentMethod } = body;

        // Get affiliate record
        const affiliate = await prisma.affiliate.findUnique({
            where: { userId: tenant.user.id },
        });

        if (!affiliate) {
            return NextResponse.json(
                { error: 'Not enrolled in affiliate program' },
                { status: 404 }
            );
        }

        // Validate payout amount
        if (!amount || amount < AFFILIATE_CONFIG.minPayoutAmount) {
            return NextResponse.json(
                { error: `Minimum payout amount is ₹${AFFILIATE_CONFIG.minPayoutAmount}` },
                { status: 400 }
            );
        }

        if (amount > affiliate.pendingPayout) {
            return NextResponse.json(
                { error: 'Insufficient pending payout' },
                { status: 400 }
            );
        }

        // Process payout (in production, integrate with payment gateway)
        await affiliateManager.processPayout(affiliate.id, amount);

        return NextResponse.json({
            message: 'Payout request submitted successfully',
            amount,
            paymentMethod,
            status: 'pending', // Would be updated once payment is processed
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        // Get payout history (would come from a separate PayoutLog table in production)
        const affiliate = await prisma.affiliate.findUnique({
            where: { userId: tenant.user.id },
        });

        if (!affiliate) {
            return NextResponse.json(
                { error: 'Not enrolled in affiliate program' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            pendingPayout: affiliate.pendingPayout,
            totalEarnings: affiliate.totalEarnings,
            minPayoutAmount: AFFILIATE_CONFIG.minPayoutAmount,
            // In production, include payout history from PayoutLog table
            payouts: [],
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
