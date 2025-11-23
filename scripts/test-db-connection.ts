import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password
        
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Database query test successful!', result);
        
        // Check if database exists and show tables
        try {
            const tables = await prisma.$queryRaw<Array<Record<string, string>>>`
                SELECT TABLE_NAME as table_name 
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = DATABASE()
            `;
            console.log('✅ Database tables:', tables.length > 0 ? tables.map(t => t.table_name) : 'No tables found');
        } catch (e) {
            console.log('⚠️  Could not list tables (this is okay if database is empty)');
        }
        
        console.log('\n✅ All database tests passed!');
    } catch (error: any) {
        console.error('❌ Database connection failed!');
        console.error('Error:', error.message);
        
        if (error.code === 'P1001') {
            console.error('\nPossible issues:');
            console.error('1. MySQL server is not running');
            console.error('2. Wrong database credentials in .env file');
            console.error('3. Database does not exist');
            console.error('4. Firewall blocking port 3306');
        } else if (error.code === 'P1000') {
            console.error('\nPossible issues:');
            console.error('1. Database does not exist - create it first');
            console.error('2. User does not have permission to access the database');
        }
        
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();

