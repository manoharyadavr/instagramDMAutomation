import { PrismaClient } from '@prisma/client';

async function createDatabase() {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
        console.error('❌ DATABASE_URL not found in .env file');
        process.exit(1);
    }

    // Parse DATABASE_URL: mysql://user:password@host:port/database
    const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    
    if (!urlMatch) {
        console.error('❌ Invalid DATABASE_URL format');
        console.error('Expected format: mysql://user:password@host:port/database');
        process.exit(1);
    }

    const [, user, password, host, port, databaseName] = urlMatch;

    console.log('Creating database...');
    console.log(`Host: ${host}:${port}`);
    console.log(`User: ${user}`);
    console.log(`Database: ${databaseName}\n`);

    try {
        // Create connection URL without database name
        const connectionUrl = `mysql://${user}:${password}@${host}:${port}`;
        
        // Create Prisma client with connection URL (no database)
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: connectionUrl,
                },
            },
        });

        // Create database
        await prisma.$executeRawUnsafe(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
        console.log(`✅ Database '${databaseName}' created successfully!`);

        // Verify
        const result = await prisma.$queryRawUnsafe<Array<{ Database: string }>>(
            `SHOW DATABASES LIKE '${databaseName}'`
        );
        
        if (result && result.length > 0) {
            console.log('✅ Database verified and ready to use!');
        }

        await prisma.$disconnect();
        
        console.log('\n✅ Next steps:');
        console.log('1. Run: npm run db:generate');
        console.log('2. Run: npm run db:migrate');
        console.log('3. Test: npm run db:test');
    } catch (error: any) {
        console.error('❌ Failed to create database!');
        console.error('Error:', error.message);
        
        if (error.code === 'P1001' || error.message?.includes('ECONNREFUSED')) {
            console.error('\nPossible issues:');
            console.error('1. MySQL server is not running');
            console.error('2. Wrong host or port in DATABASE_URL');
            console.error('3. Firewall blocking port 3306');
        } else if (error.code === 'P1000' || error.message?.includes('Access denied')) {
            console.error('\nPossible issues:');
            console.error('1. Wrong username or password');
            console.error('2. User does not have permission to create databases');
        }
        
        console.error('\n💡 Alternative: Create database manually using MySQL Workbench or command line');
        process.exit(1);
    }
}

createDatabase();

