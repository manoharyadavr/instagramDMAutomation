import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Instagram OAuth Callback Route for User Login
 * 
 * This route handles the OAuth callback from Facebook/Instagram
 * and creates/logs in the user account.
 * 
 * GET /api/auth/callback/instagram
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
            console.error('Instagram OAuth error:', error);
            return NextResponse.redirect(new URL(`/auth/login?error=${error}`, req.url));
        }

        if (!code) {
            return NextResponse.redirect(new URL('/auth/login?error=no_code', req.url));
        }

        const clientId = process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_CLIENT_ID || process.env.INSTAGRAM_CLIENT_ID;
        const clientSecret = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET || process.env.INSTAGRAM_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`;

        if (!clientId || !clientSecret) {
            console.error('Instagram OAuth: Missing credentials');
            return NextResponse.redirect(new URL('/auth/login?error=oauth_config_missing', req.url));
        }

        // Exchange code for access token
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;
        
        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error('Token exchange error:', tokenData.error);
            return NextResponse.redirect(new URL(`/auth/login?error=${tokenData.error.message || 'token_exchange_failed'}`, req.url));
        }

        const accessToken = tokenData.access_token;

        // Get user info from Facebook
        const userRes = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id,name,email`);
        const userData = await userRes.json();

        if (userData.error) {
            console.error('User info error:', userData.error);
            // If no email, try to get Instagram account info
            // For Instagram login, we might not have email, so use Instagram ID
            const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
            const pagesData = await pagesRes.json();

            if (pagesData.data && pagesData.data.length > 0) {
                const page = pagesData.data[0];
                const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                const igData = await igRes.json();

                if (igData.instagram_business_account) {
                    const igDetailsRes = await fetch(`https://graph.facebook.com/v19.0/${igData.instagram_business_account.id}?fields=id,username&access_token=${accessToken}`);
                    const igDetails = await igDetailsRes.json();

                    // Use Instagram ID as identifier (since no email)
                    const identifier = igDetails.id || igDetails.username || userData.id;
                    const email = `${identifier}@instagram.oauth`;

                    // Create or get user
                    let user = await prisma.user.findUnique({
                        where: { email },
                        include: { tenant: true },
                    });

                    if (!user) {
                        const tenantSlug = (igDetails.username || identifier).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const tenant = await prisma.tenant.create({
                            data: {
                                name: igDetails.username || `Instagram User ${identifier}`,
                                slug: tenantSlug,
                            },
                        });

                        user = await prisma.user.create({
                            data: {
                                email,
                                name: igDetails.username || `Instagram User`,
                                tenantId: tenant.id,
                                role: 'USER',
                            } as any,
                            include: { tenant: true },
                        });

                        // Also save Instagram account
                        await prisma.instagramAccount.upsert({
                            where: { instagramId: igDetails.id },
                            update: {
                                accessToken,
                                username: igDetails.username,
                            },
                            create: {
                                tenantId: tenant.id,
                                instagramId: igDetails.id,
                                username: igDetails.username || '',
                                accessToken,
                                enableAutoReply: false,
                            },
                        });
                    }

                    if (!user) {
                        return NextResponse.redirect(new URL('/auth/login?error=user_creation_failed', req.url));
                    }

                    // Create a session token and redirect to complete login
                    // Store user info temporarily to complete login
                    const loginToken = Buffer.from(JSON.stringify({ email, userId: user.id })).toString('base64');
                    return NextResponse.redirect(new URL(`/auth/instagram-complete?token=${loginToken}`, req.url));
                }
            }

            return NextResponse.redirect(new URL('/auth/login?error=no_instagram_account', req.url));
        }

        // If we have email from Facebook
        if (userData.email) {
            // Check if user exists
            let user = await prisma.user.findUnique({
                where: { email: userData.email },
                include: { tenant: true },
            });

            if (!user) {
                // Create new user and tenant
                const tenantSlug = userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const tenant = await prisma.tenant.create({
                    data: {
                        name: userData.name || userData.email.split('@')[0],
                        slug: tenantSlug,
                    },
                });

                user = await prisma.user.create({
                    data: {
                        email: userData.email,
                        name: userData.name || null,
                        tenantId: tenant.id,
                        role: 'USER',
                    } as any,
                    include: { tenant: true },
                });
            }

            if (!user) {
                return NextResponse.redirect(new URL('/auth/login?error=user_not_found', req.url));
            }

            // Try to get Instagram account and save it
            try {
                const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
                const pagesData = await pagesRes.json();

                if (pagesData.data && pagesData.data.length > 0) {
                    const page = pagesData.data[0];
                    const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                    const igData = await igRes.json();

                    if (igData.instagram_business_account) {
                        const igDetailsRes = await fetch(`https://graph.facebook.com/v19.0/${igData.instagram_business_account.id}?fields=id,username&access_token=${accessToken}`);
                        const igDetails = await igDetailsRes.json();

                        await prisma.instagramAccount.upsert({
                            where: { instagramId: igDetails.id },
                            update: {
                                accessToken,
                                username: igDetails.username,
                            },
                            create: {
                                tenantId: user.tenantId,
                                instagramId: igDetails.id,
                                username: igDetails.username || '',
                                accessToken,
                                enableAutoReply: false,
                            },
                        });
                    }
                }
            } catch (igError) {
                console.error('Error fetching Instagram account:', igError);
                // Continue even if Instagram account fetch fails
            }

            // Create session and redirect to dashboard
            const loginToken = Buffer.from(JSON.stringify({ email: userData.email, userId: user.id })).toString('base64');
            return NextResponse.redirect(new URL(`/auth/instagram-complete?token=${loginToken}`, req.url));
        }

        // Fallback: redirect to login
        return NextResponse.redirect(new URL('/auth/login?error=no_email', req.url));

    } catch (error: any) {
        console.error('Instagram OAuth callback error:', error);
        return NextResponse.redirect(new URL(`/auth/login?error=${error.message || 'callback_failed'}`, req.url));
    }
}

