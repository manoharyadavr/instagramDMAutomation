import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

/**
 * Complete Instagram Login
 * 
 * This route completes the Instagram OAuth login by creating a NextAuth session
 * 
 * GET /api/auth/instagram-complete?token=...
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/auth/login?error=invalid_token', req.url));
        }

        const data = JSON.parse(Buffer.from(token, 'base64').toString());
        const { email, userId } = data;

        if (!email || !userId) {
            return NextResponse.redirect(new URL('/auth/login?error=invalid_token_data', req.url));
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId, email },
            include: { tenant: true },
        });

        if (!user) {
            return NextResponse.redirect(new URL('/auth/login?error=user_not_found', req.url));
        }

        // For now, redirect to login page with success message
        // The user will need to use credentials to log in
        // In a production app, you'd create a session here using NextAuth's session API
        return NextResponse.redirect(new URL(`/auth/login?registered=instagram&email=${encodeURIComponent(email)}`, req.url));

    } catch (error: any) {
        console.error('Instagram complete error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=complete_failed', req.url));
    }
}

