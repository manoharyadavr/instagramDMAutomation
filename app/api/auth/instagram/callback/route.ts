import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getPagesAndInstagramAccounts } from '@/lib/instagram/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return NextResponse.redirect(new URL('/auth/login?error=session_required', req.url));
    }

    // If tenantId is not in session, try to fetch it from database
    let tenantId = session.user.tenantId;
    
    if (!tenantId) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            include: { tenant: true },
        });

        if (!user || !user.tenantId) {
            return NextResponse.redirect(new URL('/auth/login?error=tenant_not_found', req.url));
        }

        tenantId = user.tenantId;
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        // 1. Exchange code for User Access Token
        const { accessToken } = await exchangeCodeForToken(code);

        // 2. Get connected IG accounts
        const accounts = await getPagesAndInstagramAccounts(accessToken);

        if (accounts.length === 0) {
            return NextResponse.json({ error: 'No Instagram Business accounts found linked to your Facebook Pages.' }, { status: 404 });
        }

        // 3. Save to DB (Upsert)
        // In a real app, we might ask the user to select WHICH account if multiple.
        // For automation, we'll save all found or just the first one. Let's save all.
        const savedAccounts = [];
        for (const acc of accounts) {
            const saved = await prisma.instagramAccount.upsert({
                where: { instagramId: acc.instagramId },
                update: {
                    accessToken: accessToken, // Note: Ideally we should exchange for a Long-Lived Token first.
                    username: acc.username,
                    tenantId: tenantId,
                },
                create: {
                    instagramId: acc.instagramId,
                    username: acc.username,
                    accessToken: accessToken,
                    tenantId: tenantId,
                },
            });
            savedAccounts.push(saved);
        }

        // Redirect to dashboard accounts page
        return NextResponse.redirect(new URL('/dashboard/accounts', req.url));

    } catch (err: any) {
        console.error('IG Auth Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
