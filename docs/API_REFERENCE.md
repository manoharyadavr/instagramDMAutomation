# API Reference

## Authentication

All API endpoints (except public ones) require authentication via NextAuth session.

### Headers
```
Cookie: next-auth.session-token=<token>
```

## Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "tenantName": "My Company" // Optional
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Instagram Accounts

#### GET `/api/instagram/accounts`
List all Instagram accounts for the current tenant.

**Response:**
```json
{
  "accounts": [
    {
      "id": 1,
      "instagramId": "123456789",
      "username": "myaccount",
      "enableAutoReply": true,
      "connectedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/api/instagram/accounts/[id]`
Get details of a specific Instagram account.

#### PATCH `/api/instagram/accounts/[id]`
Update Instagram account configuration.

**Request Body:**
```json
{
  "enableAutoReply": true,
  "replyTemplateId": 1,
  "dmTemplateId": 2
}
```

### Billing

#### GET `/api/billing/subscriptions`
Get current subscription for the tenant.

**Response:**
```json
{
  "subscription": {
    "id": 1,
    "planId": "plan_pro",
    "status": "ACTIVE",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z"
  }
}
```

#### POST `/api/billing/subscriptions`
Create a new subscription.

**Request Body:**
```json
{
  "planId": "plan_pro",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerContact": "+1234567890",
  "referralCode": "abc123" // Optional
}
```

**Response:**
```json
{
  "subscription": {...},
  "razorpaySubscription": {
    "id": "sub_xxx",
    "short_url": "https://razorpay.com/..."
  }
}
```

#### POST `/api/billing/subscriptions/[id]/cancel`
Cancel a subscription.

#### GET `/api/billing/usage`
Get usage statistics for current billing period.

**Response:**
```json
{
  "used": 500,
  "limit": 10000,
  "remaining": 9500
}
```

#### GET `/api/billing/history`
Get billing history.

### Affiliate

#### POST `/api/affiliate/enroll`
Enroll current user in affiliate program.

**Response:**
```json
{
  "message": "Successfully enrolled in affiliate program",
  "affiliate": {
    "referralCode": "user-abc123",
    "referralUrl": "http://localhost:3000/signup?ref=user-abc123"
  }
}
```

#### GET `/api/affiliate/enroll`
Get affiliate statistics for current user.

**Response:**
```json
{
  "affiliate": {
    "referralCode": "user-abc123",
    "totalEarnings": 1500.00,
    "pendingPayout": 500.00,
    "totalReferrals": 5,
    "referralUrl": "http://localhost:3000/signup?ref=user-abc123"
  }
}
```

#### GET `/api/affiliate/leaderboard`
Get top affiliates leaderboard.

**Response:**
```json
{
  "leaderboard": [
    {
      "id": 1,
      "referralCode": "user-abc123",
      "totalEarnings": 1500.00,
      "totalReferrals": 5,
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### GET `/api/affiliate/payouts`
Get payout history.

#### POST `/api/affiliate/track`
Track a referral click (public endpoint).

**Request Body:**
```json
{
  "referralCode": "user-abc123",
  "metadata": {
    "source": "email"
  }
}
```

### Admin

#### GET `/api/admin/stats`
Get admin dashboard statistics (SUPERADMIN only).

**Response:**
```json
{
  "totalUsers": 100,
  "totalTenants": 50,
  "totalAffiliates": 20,
  "totalRevenue": 50000.00
}
```

#### GET `/api/admin/affiliates`
List all affiliates with pagination (SUPERADMIN only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

### Webhooks

#### GET `/api/webhooks/instagram`
Instagram webhook verification.

#### POST `/api/webhooks/instagram`
Receive Instagram webhook events.

#### POST `/api/webhooks/razorpay`
Receive Razorpay webhook events.

### Dashboard

#### GET `/api/dashboard/stats`
Get dashboard statistics for current tenant.

**Response:**
```json
{
  "accounts": 2,
  "templates": 5,
  "automations": 150,
  "repliesToday": 10
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message"
}
```

Status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error


