import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signupSchema } from '@/lib/validation';
import { mailer } from '@/lib/mailer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = signupSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create tenant if tenantName provided, otherwise use default
        let tenant;
        if (data.tenantName) {
            const tenantSlug = data.tenantName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Check if tenant slug exists
            const existingTenant = await prisma.tenant.findUnique({
                where: { slug: tenantSlug },
            });

            if (existingTenant) {
                tenant = existingTenant;
            } else {
                tenant = await prisma.tenant.create({
                    data: {
                        name: data.tenantName,
                        slug: tenantSlug,
                    },
                });
            }
        } else {
            // Create a default tenant with email-based slug
            const tenantSlug = data.email
                .split('@')[0]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-');

            tenant = await prisma.tenant.create({
                data: {
                    name: data.name,
                    slug: tenantSlug,
                },
            });
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                tenantId: tenant.id,
                role: 'USER',
            },
        });

        // Send welcome email (non-blocking)
        mailer.sendWelcomeEmail(user.email, user.name || 'User').catch(console.error);

        return NextResponse.json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to create user' },
            { status: 500 }
        );
    }
}


