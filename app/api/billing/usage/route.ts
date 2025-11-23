import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { quotaManager } from '@/lib/razorpay/quota';

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        const usage = await quotaManager.getUsage(tenant.tenantId);

        return NextResponse.json({ usage });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
