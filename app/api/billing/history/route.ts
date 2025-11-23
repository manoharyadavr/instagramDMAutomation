import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();
        const searchParams = req.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const [billingLogs, total] = await Promise.all([
            prisma.billingLog.findMany({
                where: { tenantId: tenant.tenantId },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.billingLog.count({
                where: { tenantId: tenant.tenantId },
            }),
        ]);

        return NextResponse.json({
            billingLogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
