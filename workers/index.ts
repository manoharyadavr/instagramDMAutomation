#!/usr/bin/env node

/**
 * Main Worker Entry Point
 * Starts all BullMQ workers for the system:
 * - Reply Worker (processes webhook events)
 * - DM Worker (sends direct messages)
 */

import './webhookWorker';
import './replyWorker';
import './dmWorker';

console.log('=================================');
console.log('Instagram Automation Workers');
console.log('=================================');
console.log('All workers initialized and running...');
console.log('Press Ctrl+C to stop');
console.log('=================================');

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down workers...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down workers...');
    process.exit(0);
});
