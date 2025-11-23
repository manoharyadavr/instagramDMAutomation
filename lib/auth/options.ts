import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    include: {
                        tenant: true,
                    },
                });

                if (!user) {
                    return null;
                }

                // In a real app, use bcrypt.compare
                // For the seed user (password: 'hashed_password_here'), we might need a workaround or just assume it works if we seeded a real hash.
                // For now, I'll implement the real check.
                // Note: The seed script used a placeholder string. You must update the seed or this will fail for that user unless we handle it.
                // Let's assume the seed script will be updated with a real hash or we just compare directly if it's the dev seed.

                // Check if user has a password (OAuth users won't have one)
                if (!user.password) {
                    return null; // OAuth user trying to use credentials
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                // Fallback for development seed if not a valid bcrypt hash (optional, but helpful for testing with 'hashed_password_here')
                if (!isPasswordValid && user.password === 'hashed_password_here' && credentials.password === 'admin') {
                    // Allow the seed user to login with 'admin' if the hash is the placeholder
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        tenantId: user.tenantId,
                    };
                }

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    tenantId: user.tenantId,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        FacebookProvider({
            id: 'instagram',
            name: 'Instagram',
            clientId: process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    if (!user.email) {
                        console.error('OAuth sign in error: No email provided');
                        return false;
                    }

                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        include: { tenant: true },
                    });

                    if (!existingUser) {
                        // Create new user and tenant for OAuth user
                        const tenantSlug = user.email
                            .split('@')[0]
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-');

                        const tenant = await prisma.tenant.create({
                            data: {
                                name: user.name || user.email.split('@')[0],
                                slug: tenantSlug,
                            },
                        });

                        await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || null,
                                // password is optional for OAuth users - omit it
                                tenantId: tenant.id,
                                role: 'USER',
                            } as any, // Type assertion needed until Prisma client is regenerated
                        });
                    }
                    return true;
                } catch (error: any) {
                    console.error('OAuth sign in error:', error);
                    console.error('Error details:', {
                        code: error.code,
                        message: error.message,
                        stack: error.stack,
                    });
                    // Log more details about the error
                    if (error.code === 'P1001' || error.message?.includes('database')) {
                        console.error('Database connection error. Please check:');
                        console.error('1. Is MySQL running?');
                        console.error('2. Are database credentials correct in .env?');
                        console.error('3. Does the database exist?');
                        console.error('4. Is DATABASE_URL set correctly in Vercel environment variables?');
                    }
                    // Return false to deny access if database operation fails
                    // This will show the "Access Denied" page
                    return false;
                }
            } else if (account?.provider === 'instagram') {
                try {
                    // Instagram OAuth doesn't provide email, so we use the Instagram ID
                    // Get Instagram account info from Facebook Graph API
                    const accessToken = account.access_token;
                    
                    // Try to get Instagram Business Account info
                    let instagramId = '';
                    let instagramUsername = '';
                    
                    try {
                        // First, get user's pages
                        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
                        const pagesData = await pagesRes.json();
                        
                        if (pagesData.data && pagesData.data.length > 0) {
                            // Get Instagram account from first page
                            const page = pagesData.data[0];
                            const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
                            const igData = await igRes.json();
                            
                            if (igData.instagram_business_account) {
                                const igDetailsRes = await fetch(`https://graph.facebook.com/v19.0/${igData.instagram_business_account.id}?fields=id,username&access_token=${accessToken}`);
                                const igDetails = await igDetailsRes.json();
                                instagramId = igDetails.id;
                                instagramUsername = igDetails.username || '';
                            }
                        }
                    } catch (igError) {
                        console.error('Error fetching Instagram account:', igError);
                    }
                    
                    // Use Instagram ID or username as identifier (since no email)
                    const identifier = instagramId || instagramUsername || account.providerAccountId || user.id;
                    const email = `${identifier}@instagram.oauth`; // Create a pseudo-email
                    
                    // Check if user exists by this pseudo-email
                    const existingUser = await prisma.user.findUnique({
                        where: { email },
                        include: { tenant: true },
                    });

                    if (!existingUser) {
                        // Create new user and tenant for Instagram OAuth user
                        const tenantSlug = instagramUsername || identifier
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-');

                        const tenant = await prisma.tenant.create({
                            data: {
                                name: instagramUsername || `Instagram User ${identifier}`,
                                slug: tenantSlug,
                            },
                        });

                        const newUser = await prisma.user.create({
                            data: {
                                email,
                                name: instagramUsername || `Instagram User`,
                                // password is optional for OAuth users - omit it
                                tenantId: tenant.id,
                                role: 'USER',
                            } as any,
                        });
                        
                        // Also save Instagram account if we got the details
                        if (instagramId && accessToken) {
                            await prisma.instagramAccount.upsert({
                                where: { instagramId },
                                update: {
                                    accessToken,
                                    username: instagramUsername,
                                },
                                create: {
                                    tenantId: tenant.id,
                                    instagramId,
                                    username: instagramUsername || '',
                                    accessToken,
                                    enableAutoReply: false,
                                },
                            });
                        }
                    } else {
                        // Update Instagram account if it exists
                        if (instagramId && accessToken) {
                            await prisma.instagramAccount.upsert({
                                where: { instagramId },
                                update: {
                                    accessToken,
                                    username: instagramUsername,
                                },
                                create: {
                                    tenantId: existingUser.tenantId,
                                    instagramId,
                                    username: instagramUsername || '',
                                    accessToken,
                                    enableAutoReply: false,
                                },
                            });
                        }
                    }
                    return true;
                } catch (error: any) {
                    console.error('Instagram OAuth sign in error:', error);
                    console.error('Error details:', {
                        code: error.code,
                        message: error.message,
                        stack: error.stack,
                    });
                    if (error.code === 'P1001' || error.message?.includes('database')) {
                        console.error('Database connection error. Please check:');
                        console.error('1. Is MySQL running?');
                        console.error('2. Are database credentials correct in .env?');
                        console.error('3. Does the database exist?');
                        console.error('4. Is DATABASE_URL set correctly in Vercel environment variables?');
                    }
                    return false;
                }
            }
            return true;
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.tenantId = token.tenantId;
                
                // If tenantId is missing, fetch from database
                if (!token.tenantId && token.email) {
                    try {
                        const dbUser = await prisma.user.findUnique({
                            where: { email: token.email },
                            include: { tenant: true },
                        });
                        if (dbUser?.tenantId) {
                            session.user.tenantId = dbUser.tenantId;
                        }
                    } catch (error) {
                        console.error('Error fetching tenantId in session callback:', error);
                    }
                }
            }
            return session;
        },
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.tenantId = user.tenantId;
            } else if (account && (account.provider === 'google' || account.provider === 'instagram')) {
                // Fetch user from database for OAuth login
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                    include: { tenant: true },
                });

                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.role = dbUser.role;
                    token.tenantId = dbUser.tenantId;
                }
            } else if (trigger === 'update' || !token.tenantId) {
                // Refresh tenantId from database if missing or on update
                if (token.email) {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: token.email },
                        include: { tenant: true },
                    });

                    if (dbUser) {
                        token.id = dbUser.id.toString();
                        token.role = dbUser.role;
                        token.tenantId = dbUser.tenantId;
                    }
                }
            }
            return token;
        },
    },
};
