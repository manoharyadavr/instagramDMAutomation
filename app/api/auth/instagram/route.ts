import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getAuthorizationUrl } from '@/lib/instagram/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            console.error('Instagram OAuth: No session found');
            return NextResponse.redirect(new URL('/auth/login?error=session_required', req.url));
        }

        // If tenantId is not in session, try to fetch it from database
        let tenantId = session.user.tenantId;
        
        if (!tenantId) {
            console.log('Instagram OAuth: tenantId not in session, fetching from database');
            const user = await prisma.user.findUnique({
                where: { email: session.user.email! },
                include: { tenant: true },
            });

            if (!user || !user.tenantId) {
                console.error('Instagram OAuth: User or tenant not found');
                return NextResponse.redirect(new URL('/auth/login?error=tenant_not_found', req.url));
            }

            tenantId = user.tenantId;
        }

        const authUrl = getAuthorizationUrl();
        return NextResponse.redirect(authUrl);
    } catch (error: any) {
        console.error('Instagram OAuth error:', error);
        return NextResponse.redirect(new URL('/dashboard/accounts?error=auth_failed', req.url));
    }
}


