# Scaling Guide

## Horizontal Scaling

The application is designed to scale horizontally. Key considerations:

### Stateless Design

- All API routes are stateless
- Session data stored in JWT tokens (NextAuth)
- No server-side session storage

### Database Scaling

#### Read Replicas
- Configure MySQL read replicas for read-heavy operations
- Update Prisma connection string to use read replicas for queries

#### Connection Pooling
- Prisma automatically handles connection pooling
- Adjust pool size based on load:
  ```prisma
  datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
    // Add connection pool settings
  }
  ```

### Queue System Scaling

#### Multiple Workers
- Run multiple worker instances:
  ```bash
  # Worker 1
  npm run worker
  
  # Worker 2 (different terminal)
  WORKER_ID=2 npm run worker
  ```

- BullMQ automatically distributes jobs across workers
- Configure concurrency per worker based on resources

#### Redis Cluster
- For high-volume scenarios, use Redis Cluster
- Update Redis connection configuration

### Application Scaling

#### Load Balancing
- Use Nginx or cloud load balancer
- Multiple Next.js instances behind load balancer
- Sticky sessions not required (stateless)

#### Container Orchestration
- Use Kubernetes for container orchestration
- Deploy multiple app replicas
- Auto-scaling based on CPU/memory metrics

### Caching Strategy

#### Redis Caching
- Cache frequently accessed data:
  - Subscription plans
  - Tenant configurations
  - Template data

#### CDN
- Use CDN for static assets
- Next.js static files can be served via CDN

### Database Optimization

#### Indexing
- All tenant-scoped tables have `tenantId` indexed
- Add indexes for frequently queried fields:
  ```sql
  CREATE INDEX idx_reply_logs_created ON ReplyLog(tenantId, createdAt);
  CREATE INDEX idx_automation_logs_action ON AutomationLog(tenantId, action, createdAt);
  ```

#### Query Optimization
- Use Prisma's `select` to fetch only needed fields
- Implement pagination for large datasets
- Use database views for complex queries

### Rate Limiting

#### Instagram API Limits
- Instagram Graph API has rate limits
- Implement per-account rate limiting
- Use queue delays to respect limits

#### Application Rate Limiting
- Implement rate limiting middleware
- Use Redis for distributed rate limiting
- Protect API endpoints from abuse

### Monitoring & Observability

#### Metrics to Monitor
- Request latency (p50, p95, p99)
- Error rates
- Queue depth
- Database connection pool usage
- Worker processing times

#### Tools
- Application Performance Monitoring (APM): New Relic, Datadog
- Log aggregation: ELK Stack, Loki
- Metrics: Prometheus + Grafana

### Worker Scaling

#### Separate Worker Deployment
- Deploy workers separately from web servers
- Scale workers independently based on queue depth
- Use auto-scaling based on queue metrics

#### Job Prioritization
- Implement job priorities in BullMQ
- Process high-priority jobs first
- Separate queues for different job types

### Database Sharding (Advanced)

For very large scale:
- Shard by tenant ID
- Route queries to appropriate shard
- Requires application-level changes

### Cost Optimization

#### Resource Right-Sizing
- Monitor actual resource usage
- Right-size containers/instances
- Use spot instances for workers (if applicable)

#### Database Optimization
- Archive old logs to cold storage
- Implement data retention policies
- Use database partitioning for large tables

## Performance Targets

- API Response Time: < 200ms (p95)
- Worker Job Processing: < 5s (p95)
- Database Query Time: < 100ms (p95)
- Page Load Time: < 2s

## Load Testing

Use tools like:
- k6
- Apache JMeter
- Artillery

Test scenarios:
- Concurrent user sessions
- Webhook event bursts
- High-volume DM sending
- Subscription creation spikes

## Scaling Checklist

- [ ] Database read replicas configured
- [ ] Redis cluster or high-availability setup
- [ ] Load balancer configured
- [ ] Multiple app instances running
- [ ] Worker instances scaled appropriately
- [ ] Monitoring and alerting set up
- [ ] Database indexes optimized
- [ ] Caching strategy implemented
- [ ] Rate limiting configured
- [ ] Backup and disaster recovery plan


