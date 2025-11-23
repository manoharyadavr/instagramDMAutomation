import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenancy';

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();
        const searchParams = req.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const processed = searchParams.get('processed');
        const type = searchParams.get('type');

        const where: any = {
            tenantId: tenant.tenantId,
        };

        if (processed !== null) {
            where.processed = processed === 'true';
        }

        if (type) {
            where.type = type;
        }

        const [events, total] = await Promise.all([
            prisma.webhookEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.webhookEvent.count({ where }),
        ]);

        return NextResponse.json({
            events,
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
