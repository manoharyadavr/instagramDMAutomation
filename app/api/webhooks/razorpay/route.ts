import { NextRequest, NextResponse } from 'next/server';
import { razorpayClient } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const signature = req.headers.get('x-razorpay-signature');
    const bodyText = await req.text();

    // Verify webhook signature
    if (!razorpayClient.verifyWebhookSignature(bodyText, signature || '')) {
        console.error('Invalid Razorpay webhook signature');
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = JSON.parse(bodyText);
    const event = body.event;
    const payload = body.payload;

    console.log(`Received Razorpay webhook: ${event}`);

    try {
        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload.payment.entity);
                break;

            case 'subscription.activated':
                await handleSubscriptionActivated(payload.subscription.entity);
                break;

            case 'subscription.charged':
                await handleSubscriptionCharged(payload.subscription.entity, payload.payment?.entity);
                break;

            case 'subscription.cancelled':
                await handleSubscriptionCancelled(payload.subscription.entity);
                break;

            case 'subscription.paused':
            case 'subscription.resumed':
                await handleSubscriptionStatusChange(payload.subscription.entity);
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

async function handlePaymentCaptured(payment: any) {
    console.log('Payment captured:', payment.id);

    // Find subscription by payment notes or subscription_id
    const subscriptionId = payment.subscription_id;

    if (subscriptionId) {
        const subscription = await prisma.subscription.findUnique({
            where: { razorpaySubId: subscriptionId },
        });

        if (subscription) {
            await prisma.billingLog.create({
                data: {
                    tenantId: subscription.tenantId,
                    amount: payment.amount / 100, // Razorpay amounts are in paise
                    currency: payment.currency,
                    description: `Payment captured for subscription ${subscriptionId}`,
                    status: 'paid',
                },
            });
        }
    }
}

async function handleSubscriptionActivated(subscription: any) {
    console.log('Subscription activated:', subscription.id);

    const dbSubscription = await prisma.subscription.findUnique({
        where: { razorpaySubId: subscription.id },
    });

    if (dbSubscription) {
        await prisma.subscription.update({
            where: { razorpaySubId: subscription.id },
            data: {
                status: 'ACTIVE',
                currentPeriodStart: new Date(subscription.current_start * 1000),
                currentPeriodEnd: new Date(subscription.current_end * 1000),
            },
        });

        await prisma.billingLog.create({
            data: {
                tenantId: dbSubscription.tenantId,
                amount: 0,
                currency: 'INR',
                description: `Subscription activated: ${subscription.id}`,
                status: 'activated',
            },
        });
    }
}

async function handleSubscriptionCharged(subscription: any, payment?: any) {
    console.log('Subscription charged:', subscription.id);

    const dbSubscription = await prisma.subscription.findUnique({
        where: { razorpaySubId: subscription.id },
    });

    if (dbSubscription) {
        await prisma.subscription.update({
            where: { razorpaySubId: subscription.id },
            data: {
                status: 'ACTIVE',
                currentPeriodStart: new Date(subscription.current_start * 1000),
                currentPeriodEnd: new Date(subscription.current_end * 1000),
            },
        });

        if (payment) {
            await prisma.billingLog.create({
                data: {
                    tenantId: dbSubscription.tenantId,
                    amount: payment.amount / 100,
                    currency: payment.currency,
                    description: `Subscription charged: ${subscription.id}`,
                    status: 'paid',
                },
            });
        }
    }
}

async function handleSubscriptionCancelled(subscription: any) {
    console.log('Subscription cancelled:', subscription.id);

    const dbSubscription = await prisma.subscription.findUnique({
        where: { razorpaySubId: subscription.id },
    });

    if (dbSubscription) {
        await prisma.subscription.update({
            where: { razorpaySubId: subscription.id },
            data: {
                status: 'CANCELED',
            },
        });

        await prisma.billingLog.create({
            data: {
                tenantId: dbSubscription.tenantId,
                amount: 0,
                currency: 'INR',
                description: `Subscription cancelled: ${subscription.id}`,
                status: 'cancelled',
            },
        });
    }
}

async function handleSubscriptionStatusChange(subscription: any) {
    const dbSubscription = await prisma.subscription.findUnique({
        where: { razorpaySubId: subscription.id },
    });

    if (dbSubscription) {
        let status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'TRIALING' = 'ACTIVE';

        // Map Razorpay status to our status
        if (subscription.status === 'active') status = 'ACTIVE';
        else if (subscription.status === 'paused') status = 'PAST_DUE';
        else if (subscription.status === 'cancelled') status = 'CANCELED';

        await prisma.subscription.update({
            where: { razorpaySubId: subscription.id },
            data: { status },
        });
    }
}
