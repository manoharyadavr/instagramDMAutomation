# Architecture Documentation

## Overview

Instagram Automation is a multi-tenant SaaS platform built with Next.js 16, TypeScript, Prisma ORM, and MySQL. It provides automated comment replies, DM automation, and affiliate marketing capabilities for Instagram Business accounts.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MySQL with Prisma ORM
- **Queue System**: BullMQ with Redis
- **Payment**: Razorpay
- **Deployment**: Docker, Nginx

## System Architecture

### Multi-Tenancy

The system uses a tenant-based architecture where:
- Each tenant has isolated data (users, accounts, templates, logs)
- All tenant-scoped tables include `tenantId` for data isolation
- Tenant context is determined from the authenticated user's session

### Core Components

#### 1. Authentication & Authorization
- **NextAuth.js** for session management
- Role-based access control (SUPERADMIN, ADMIN, USER)
- Instagram OAuth integration for account connection

#### 2. Instagram Integration
- **Graph API Client** (`lib/instagram/graph.ts`): Handles all Instagram API interactions
- **Webhook Manager** (`lib/instagram/webhook-manager.ts`): Manages webhook subscriptions
- **Reply Engine** (`lib/instagram/reply-engine.ts`): Processes comment replies
- **DM Engine** (`lib/instagram/dm-engine.ts`): Handles direct message automation

#### 3. Queue System
- **BullMQ** for job processing
- Three main queues:
  - `webhook-queue`: Processes Instagram webhook events
  - `dm-queue`: Handles DM sending tasks
- Workers run separately from the main application

#### 4. Billing System
- **Razorpay** integration for subscriptions
- Quota management based on subscription plans
- Webhook handlers for payment events

#### 5. Affiliate Program
- Referral code generation and tracking
- Commission calculation (30% default)
- Payout management

## Data Flow

### Comment Reply Flow

1. Instagram sends webhook event → `/api/webhooks/instagram`
2. Webhook handler validates and stores event in database
3. Event is queued to `webhook-queue`
4. Reply Worker processes the event:
   - Checks quota
   - Retrieves template
   - Replaces variables
   - Posts reply via Instagram API
   - Logs result
5. If DM template configured, queues DM task

### DM Sending Flow

1. DM task queued to `dm-queue`
2. DM Worker processes task:
   - Retrieves template
   - Replaces variables
   - Sends DM via Instagram API
   - Logs result

### Subscription Flow

1. User selects plan → `/api/billing/subscriptions` (POST)
2. Creates Razorpay subscription
3. User completes payment on Razorpay
4. Razorpay webhook → `/api/webhooks/razorpay`
5. System updates subscription status
6. Quota limits updated based on plan

## Database Schema

### Core Models

- **Tenant**: Organization/workspace
- **User**: System users (linked to tenant)
- **InstagramAccount**: Connected Instagram Business accounts
- **Template**: Reply/DM templates with variable substitution
- **Subscription**: Razorpay subscription records
- **Affiliate**: Affiliate program participants

### Logging Models

- **WebhookEvent**: Incoming webhook events
- **ReplyLog**: Comment reply attempts
- **DMLog**: DM sending attempts
- **AutomationLog**: General automation events
- **BillingLog**: Payment transactions

## Security

- All API routes require authentication (except public endpoints)
- Tenant isolation enforced at database query level
- Admin routes require SUPERADMIN role
- Password hashing with bcrypt
- Webhook signature verification

## Scalability Considerations

- Stateless API design
- Queue-based processing for async operations
- Database indexing on tenantId for performance
- Redis for queue management
- Horizontal scaling support via Docker

## Environment Variables

See `.env.example` for required environment variables.


