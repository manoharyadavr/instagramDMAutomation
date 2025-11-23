import { NextRequest, NextResponse } from 'next/server';
import { affiliateManager } from '@/lib/affiliate';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { referralCode } = body;

        if (!referralCode) {
            return NextResponse.json(
                { error: 'Referral code is required' },
                { status: 400 }
            );
        }

        // Track the referral
        await affiliateManager.trackReferral(referralCode, {
            userAgent: req.headers.get('user-agent'),
            referer: req.headers.get('referer'),
            ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        });

        // Set cookie to track referral for 30 days
        const response = NextResponse.json({
            message: 'Referral tracked successfully',
            referralCode,
        });

        response.cookies.set('ref_code', referralCode, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
