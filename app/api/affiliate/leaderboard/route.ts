import { NextRequest, NextResponse } from 'next/server';
import { affiliateManager } from '@/lib/affiliate';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        const topAffiliates = await affiliateManager.getTopAffiliates(limit);

        // Format leaderboard data
        const leaderboard = topAffiliates.map((affiliate: typeof topAffiliates[number]) => ({
            id: affiliate.id,
            referralCode: affiliate.referralCode,
            totalEarnings: affiliate.totalEarnings || 0,
            pendingPayout: affiliate.pendingPayout || 0,
            totalReferrals: affiliate.totalReferrals || 0,
            user: affiliate.user || null,
        }));

        return NextResponse.json({ leaderboard });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
