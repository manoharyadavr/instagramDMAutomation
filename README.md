# ManiorainstagramAutomation

## Overview
Multi-tenant SaaS for Instagram automation, including comment replies, DM automation, and affiliate marketing.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + MySQL
- Redis + BullMQ
- NextAuth
- Docker + Nginx

## Setup
1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Run `docker-compose -f infra/docker-compose.dev.yml up -d`
4. Run `npm run dev`
