import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { razorpayClient } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const tenant = await requireTenant();
        const body = await req.json();
        const cancelAtCycleEnd = body.cancelAtCycleEnd || false;
        const { id } = await params;

        // Get subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                id: parseInt(id),
                tenantId: tenant.tenantId,
            },
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        if (subscription.status === 'CANCELED') {
            return NextResponse.json(
                { error: 'Subscription is already cancelled' },
                { status: 400 }
            );
        }

        // Cancel in Razorpay
        await razorpayClient.cancelSubscription(
            subscription.razorpaySubId,
            cancelAtCycleEnd
        );

        // Update in DB
        const updated = await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: cancelAtCycleEnd ? 'ACTIVE' : 'CANCELED', // Will be CANCELED at end if cancelAtCycleEnd
            },
        });

        // Log billing event
        await prisma.billingLog.create({
            data: {
                tenantId: tenant.tenantId,
                amount: 0,
                currency: 'INR',
                description: `Subscription cancelled: ${subscription.razorpaySubId}`,
                status: 'cancelled',
            },
        });

        return NextResponse.json({
            subscription: updated,
            message: cancelAtCycleEnd
                ? 'Subscription will be cancelled at the end of billing period'
                : 'Subscription cancelled immediately',
        });
    } catch (error: any) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
