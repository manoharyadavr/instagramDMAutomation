import { NextRequest, NextResponse } from 'next/server';
import { WebhookManager } from '@/lib/instagram/webhook-manager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const webhookManager = new WebhookManager();
const CALLBACK_URL = `${process.env.NEXTAUTH_URL}/api/webhooks/instagram`;
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'my_secure_verify_token';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPERADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { pageAccessToken, appId } = body;

        if (!pageAccessToken || !appId) {
            return NextResponse.json(
                { error: 'pageAccessToken and appId are required' },
                { status: 400 }
            );
        }

        const result = await webhookManager.subscribeWebhooks(
            pageAccessToken,
            appId,
            CALLBACK_URL,
            VERIFY_TOKEN
        );

        return NextResponse.json({
            message: 'Webhook subscription created successfully',
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPERADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const appId = searchParams.get('appId');
        const appAccessToken = searchParams.get('appAccessToken');

        if (!appId || !appAccessToken) {
            return NextResponse.json(
                { error: 'appId and appAccessToken are required' },
                { status: 400 }
            );
        }

        const subscriptions = await webhookManager.listSubscriptions(appId, appAccessToken);

        return NextResponse.json(subscriptions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'SUPERADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const appId = searchParams.get('appId');
        const appAccessToken = searchParams.get('appAccessToken');

        if (!appId || !appAccessToken) {
            return NextResponse.json(
                { error: 'appId and appAccessToken are required' },
                { status: 400 }
            );
        }

        const result = await webhookManager.deleteSubscription(appId, appAccessToken);

        return NextResponse.json({
            message: 'Webhook subscription deleted successfully',
            data: result,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
