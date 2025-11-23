import { NextResponse } from 'next/server';
import { upstashRedis } from '@/lib/redis';

/**
 * Test Redis Connection
 * 
 * GET /api/test-redis
 * 
 * Tests Upstash Redis connection and returns test data
 */
export async function GET() {
    try {
        // Test 1: Set a value
        await upstashRedis.set('test:hello', 'maniora');
        
        // Test 2: Get the value
        const value = await upstashRedis.get('test:hello');
        
        // Test 3: Set with expiration
        await upstashRedis.set('test:expires', 'will-expire', { ex: 60 });
        
        // Test 4: Increment counter
        const counter = await upstashRedis.incr('test:counter');
        
        // Test 5: List operations
        await upstashRedis.lpush('test:list', 'item1', 'item2', 'item3');
        const listLength = await upstashRedis.llen('test:list');
        
        // Test 6: Hash operations
        await upstashRedis.hset('test:hash', {
            field1: 'value1',
            field2: 'value2',
        });
        const hashValue = await upstashRedis.hget('test:hash', 'field1');
        
        return NextResponse.json({
            success: true,
            message: 'Redis connection successful! ✅',
            tests: {
                setGet: value,
                counter,
                listLength,
                hashValue,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Redis test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                message: 'Redis connection failed. Check your UPSTASH_REDIS_URL and UPSTASH_REDIS_REST_TOKEN environment variables.',
            },
            { status: 500 }
        );
    }
}

