import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenancy';
import { webhookQueue } from '@/lib/queue';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tenant = await requireTenant();
        const eventId = parseInt(params.id);

        // Get the webhook event
        const event = await prisma.webhookEvent.findFirst({
            where: {
                id: eventId,
                tenantId: tenant.tenantId,
            },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Get the Instagram account for this event
        // We need to find which account this event belongs to
        // Since the event payload might contain the IG ID, let's extract it
        const payload = event.payload as any;

        // For manual retry, we need the Instagram account
        const account = await prisma.instagramAccount.findFirst({
            where: { tenantId: tenant.tenantId },
            orderBy: { connectedAt: 'desc' },
        });

        if (!account) {
            return NextResponse.json(
                { error: 'No Instagram account found' },
                { status: 400 }
            );
        }

        // Re-queue the event
        await webhookQueue.add('process-webhook', {
            tenantId: tenant.tenantId,
            instagramAccountId: account.instagramId,
            accessToken: account.accessToken,
            event: {
                field: event.type,
                value: payload,
            },
        });

        // Mark as unprocessed so it can be processed again
        await prisma.webhookEvent.update({
            where: { id: event.id },
            data: { processed: false },
        });

        return NextResponse.json({
            message: 'Event re-queued successfully',
            eventId: event.id,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
