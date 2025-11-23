import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    tenantName: z.string().min(2, 'Tenant name must be at least 2 characters').optional(),
});

// Instagram account validation
export const instagramAccountSchema = z.object({
    instagramId: z.string().min(1, 'Instagram ID is required'),
    username: z.string().min(1, 'Username is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    enableAutoReply: z.boolean().default(false),
    replyTemplateId: z.number().optional(),
    dmTemplateId: z.number().optional(),
});

// Template validation
export const templateSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    type: z.enum(['REPLY', 'DM']),
    content: z.string().min(1, 'Template content is required'),
    isDefault: z.boolean().default(false),
});

// Subscription validation
export const subscriptionSchema = z.object({
    planId: z.string().min(1, 'Plan ID is required'),
});

// Affiliate validation
export const affiliateEnrollSchema = z.object({
    userId: z.number().int().positive(),
    tenantId: z.number().int().positive(),
});

export const affiliateTrackSchema = z.object({
    referralCode: z.string().min(1, 'Referral code is required'),
    metadata: z.record(z.any()).optional(),
});

// Webhook validation
export const webhookEventSchema = z.object({
    type: z.string().min(1, 'Event type is required'),
    payload: z.any(),
});

// Pagination schema
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

// Utility function to validate and parse
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

// Utility function to safely validate (returns error instead of throwing)
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}


