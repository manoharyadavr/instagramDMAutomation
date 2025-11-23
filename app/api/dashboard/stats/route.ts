import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        const [accounts, templates, automations, repliesToday] = await Promise.all([
            prisma.instagramAccount.count({
                where: { tenantId: tenant.tenantId },
            }),
            prisma.template.count({
                where: { tenantId: tenant.tenantId },
            }),
            prisma.automationLog.count({
                where: {
                    tenantId: tenant.tenantId,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            prisma.replyLog.count({
                where: {
                    tenantId: tenant.tenantId,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
        ]);

        return NextResponse.json({
            accounts,
            templates,
            automations,
            repliesToday,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


