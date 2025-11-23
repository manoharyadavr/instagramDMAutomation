import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        const accounts = await prisma.instagramAccount.findMany({
            where: {
                tenantId: tenant.tenantId,
            },
            select: {
                id: true,
                instagramId: true,
                username: true,
                enableAutoReply: true,
                connectedAt: true,
            },
            orderBy: {
                connectedAt: 'desc',
            },
        });

        return NextResponse.json({ accounts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


