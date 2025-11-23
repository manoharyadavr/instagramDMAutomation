import { NextRequest, NextResponse } from 'next/server';

/**
 * Instagram OAuth Login Route
 * 
 * This route initiates Facebook OAuth for Instagram user login.
 * Uses Facebook OAuth (not Instagram Basic Display) to support Business accounts.
 * 
 * GET /api/instagram/auth
 */
export async function GET(req: NextRequest) {
    try {
        const clientId = process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_CLIENT_ID || process.env.INSTAGRAM_CLIENT_ID;
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`;
        
        if (!clientId) {
            console.error('Instagram OAuth: Missing INSTAGRAM_APP_ID or FACEBOOK_CLIENT_ID');
            return NextResponse.redirect(new URL('/auth/login?error=oauth_config_missing', req.url));
        }

        if (!process.env.NEXTAUTH_URL) {
            console.error('Instagram OAuth: Missing NEXTAUTH_URL');
            return NextResponse.redirect(new URL('/auth/login?error=oauth_config_missing', req.url));
        }

        // Facebook OAuth URL with required scopes for Instagram Business accounts
        const scope = [
            'pages_show_list',
            'pages_read_engagement',
            'pages_manage_metadata',
            'instagram_basic',
            'instagram_manage_messages',
            'instagram_manage_comments',
            'business_management'
        ].join(',');

        const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=instagram_login`;

        return NextResponse.redirect(authUrl);
    } catch (error: any) {
        console.error('Instagram OAuth error:', error);
        return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', req.url));
    }
}

