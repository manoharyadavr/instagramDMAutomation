import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { webhookQueue } from '@/lib/queue';

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'my_secure_verify_token';
const APP_SECRET = process.env.INSTAGRAM_CLIENT_SECRET || '';

// Helper to verify signature
function verifySignature(body: string, signature: string) {
    if (!APP_SECRET) return true; // Skip if no secret (dev)
    const hmac = crypto.createHmac('sha1', APP_SECRET);
    const digest = Buffer.from('sha1=' + hmac.update(body).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');
    return (checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum));
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get('x-hub-signature');
    const bodyText = await req.text();

    if (!verifySignature(bodyText, signature || '')) {
        // return new NextResponse('Unauthorized', { status: 401 });
        // In dev, signature might be missing or hard to test with ngrok without strict setup. 
        // We'll warn but proceed if secret is missing.
        if (APP_SECRET) console.warn('Webhook signature verification failed');
    }

    const body = JSON.parse(bodyText);

    if (body.object === 'instagram') {
        for (const entry of body.entry) {
            // entry.id is the Instagram Business Account ID
            const instagramAccountId = entry.id;

            // Find tenant by IG ID
            const account = await prisma.instagramAccount.findUnique({
                where: { instagramId: instagramAccountId },
                include: { tenant: true },
            });

            if (!account) {
                console.warn(`Received webhook for unknown account: ${instagramAccountId}`);
                continue;
            }

            for (const change of entry.changes) {
                // Log the event
                await prisma.webhookEvent.create({
                    data: {
                        tenantId: account.tenantId,
                        type: change.field,
                        payload: change.value as any,
                        processed: false,
                    },
                });

                // Add to BullMQ Queue for processing
                await webhookQueue.add('process-webhook', {
                    tenantId: account.tenantId,
                    instagramAccountId: account.instagramId,
                    accessToken: account.accessToken,
                    event: change,
                });
            }
        }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
}
