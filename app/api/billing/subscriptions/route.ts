import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenancy';
import { razorpayClient } from '@/lib/razorpay';
import { SUBSCRIPTION_PLANS } from '@/lib/razorpay/plans';
import { prisma } from '@/lib/prisma';
import { affiliateManager } from '@/lib/affiliate';
import { z } from 'zod';
import { cookies } from 'next/headers';

const createSubscriptionSchema = z.object({
    planId: z.string(),
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerContact: z.string().optional(),
    referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const tenant = await requireTenant();
        const body = await req.json();

        // Check for referral code in cookie if not in body
        const cookieStore = await cookies();
        const refCodeCookie = cookieStore.get('ref_code');
        if (!body.referralCode && refCodeCookie) {
            body.referralCode = refCodeCookie.value;
        }

        const data = createSubscriptionSchema.parse(body);

        // Check if tenant already has an active subscription
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                tenantId: tenant.tenantId,
                status: { in: ['ACTIVE', 'TRIALING'] },
            },
        });

        if (existingSubscription) {
            return NextResponse.json(
                { error: 'You already have an active subscription. Please cancel it first.' },
                { status: 400 }
            );
        }

        // Create Razorpay subscription
        const razorpaySubscription = (await razorpayClient.createSubscription({
            plan_id: data.planId,
            customer_notify: 1,
            total_count: 12, // 12 months for yearly, can be adjusted
            quantity: 1,
            notes: {
                tenant_id: tenant.tenantId.toString(),
                tenant_name: tenant.user.name || '',
                referral_code: data.referralCode || '',
            },
        })) as any;

        // Save to database
        const subscription = await prisma.subscription.create({
            data: {
                tenantId: tenant.tenantId,
                razorpaySubId: razorpaySubscription.id,
                planId: data.planId,
                status: 'ACTIVE', // Will be updated by webhook
                currentPeriodStart: new Date(razorpaySubscription.current_start * 1000),
                currentPeriodEnd: new Date(razorpaySubscription.current_end * 1000),
            },
        });

        // Log billing event
        await prisma.billingLog.create({
            data: {
                tenantId: tenant.tenantId,
                amount: 0, // Will be updated when payment is captured
                currency: 'INR',
                description: `Subscription created: ${data.planId}`,
                status: 'pending',
            },
        });

        // Track affiliate conversion if referral code exists
        if (data.referralCode) {
            try {
                const plan = SUBSCRIPTION_PLANS[data.planId];
                const amount = plan ? plan.price : 0;

                await affiliateManager.trackConversion(
                    data.referralCode,
                    subscription.id,
                    amount
                );
            } catch (error) {
                console.error('Failed to track affiliate conversion:', error);
                // Don't fail the subscription creation if affiliate tracking fails
            }
        }

        return NextResponse.json({
            subscription,
            razorpaySubscription,
            message: 'Subscription created successfully',
        });
    } catch (error: any) {
        console.error('Create subscription error:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const tenant = await requireTenant();

        const subscriptions = await prisma.subscription.findMany({
            where: { tenantId: tenant.tenantId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ subscriptions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
