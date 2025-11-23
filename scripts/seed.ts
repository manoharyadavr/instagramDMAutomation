import { PrismaClient, UserRole, TemplateType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Create Sample Tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo-tenant' },
        update: {},
        create: {
            name: 'Demo Tenant',
            slug: 'demo-tenant',
        },
    });

    console.log(`Created tenant with id: ${tenant.id}`);

    // 2. Create Superadmin User
    const superadmin = await prisma.user.upsert({
        where: { email: 'admin@maniora.in' },
        update: {},
        create: {
            email: 'admin@maniora.in',
            password: 'hashed_password_here', // In production, use bcrypt
            name: 'Super Admin',
            role: UserRole.SUPERADMIN,
            tenantId: tenant.id,
        },
    });

    console.log(`Created superadmin with id: ${superadmin.id}`);

    // 3. Create Sample Templates
    // Reply Template
    await prisma.template.create({
        data: {
            tenantId: tenant.id,
            name: 'Welcome Reply',
            type: TemplateType.REPLY,
            content: 'Thanks for your comment! Check your DM for more info. 🚀',
            isDefault: true,
        },
    });

    // DM Template
    await prisma.template.create({
        data: {
            tenantId: tenant.id,
            name: 'Welcome DM',
            type: TemplateType.DM,
            content: 'Hey {{username}}! Here is the link you asked for: https://maniora.in',
            isDefault: true,
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
