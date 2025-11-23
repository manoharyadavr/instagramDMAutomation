import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPERADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [totalUsers, totalTenants, totalAffiliates, billingLogs] = await Promise.all([
            prisma.user.count(),
            prisma.tenant.count(),
            prisma.affiliate.count(),
            prisma.billingLog.findMany({
                where: { status: 'paid' },
            }),
        ]);

        const totalRevenue = billingLogs.reduce((sum, log) => sum + log.amount, 0);

        return NextResponse.json({
            totalUsers,
            totalTenants,
            totalAffiliates,
            totalRevenue,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


