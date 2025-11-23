import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenancy';
import { z } from 'zod';

const updateConfigSchema = z.object({
    enableAutoReply: z.boolean().optional(),
    replyTemplateId: z.number().nullable().optional(),
    dmTemplateId: z.number().nullable().optional(),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tenant = await requireTenant();
        const body = await req.json();
        const data = updateConfigSchema.parse(body);

        // Verify account belongs to tenant
        const account = await prisma.instagramAccount.findFirst({
            where: {
                id: parseInt(params.id),
                tenantId: tenant.tenantId,
            },
        });

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        // Update config
        const updated = await prisma.instagramAccount.update({
            where: { id: account.id },
            data,
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tenant = await requireTenant();

        const account = await prisma.instagramAccount.findFirst({
            where: {
                id: parseInt(params.id),
                tenantId: tenant.tenantId,
            },
        });

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        return NextResponse.json(account);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
