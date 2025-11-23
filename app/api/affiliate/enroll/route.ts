import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { affiliateManager } from '@/lib/affiliate';

export async function POST(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        // Enroll user as affiliate
        const affiliate = await affiliateManager.enrollAffiliate(
            parseInt(tenant.user.id),
            tenant.tenantId
        );

        return NextResponse.json({
            message: 'Successfully enrolled in affiliate program',
            affiliate: {
                referralCode: affiliate.referralCode,
                referralUrl: `${process.env.NEXTAUTH_URL}/signup?ref=${affiliate.referralCode}`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        // Get affiliate stats
        const stats = await affiliateManager.getAffiliateStats(parseInt(tenant.user.id));

        if (!stats) {
            return NextResponse.json(
                { error: 'Not enrolled in affiliate program' },
                { status: 404 }
            );
        }

        return NextResponse.json({ affiliate: stats });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
