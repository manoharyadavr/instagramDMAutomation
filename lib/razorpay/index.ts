import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface CreateSubscriptionParams {
    plan_id: string;
    customer_notify: boolean | 0 | 1;
    total_count: number;
    quantity?: number;
    notes?: Record<string, string>;
}

export interface Customer {
    name: string;
    email: string;
    contact?: string;
}

export class RazorpayClient {
    /**
     * Create a new subscription
     */
    async createSubscription(params: CreateSubscriptionParams) {
        return razorpay.subscriptions.create(params);
    }

    /**
     * Fetch subscription details
     */
    async fetchSubscription(subscriptionId: string) {
        return razorpay.subscriptions.fetch(subscriptionId);
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = false) {
        return razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
    }

    /**
     * List all subscriptions
     */
    async listSubscriptions(options?: { count?: number; skip?: number }) {
        return razorpay.subscriptions.all(options);
    }

    /**
     * Fetch all payments for a subscription
     */
    async fetchSubscriptionPayments(subscriptionId: string) {
        return razorpay.subscriptions.fetchPayments(subscriptionId);
    }

    /**
     * Create a payment link (for one-time payments if needed)
     */
    async createPaymentLink(params: {
        amount: number;
        currency: string;
        description: string;
        customer: Customer;
        notify?: {
            sms: boolean;
            email: boolean;
        };
        callback_url?: string;
        callback_method?: string;
    }) {
        return razorpay.paymentLink.create(params);
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(body: string, signature: string, secret?: string): boolean {
        const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || '';

        if (!webhookSecret) {
            console.warn('RAZORPAY_WEBHOOK_SECRET not set, skipping verification');
            return true; // In dev, allow without verification
        }

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        return expectedSignature === signature;
    }

    /**
     * Fetch invoice by ID
     */
    async fetchInvoice(invoiceId: string) {
        return razorpay.invoices.fetch(invoiceId);
    }

    /**
     * Create customer
     */
    async createCustomer(customer: Customer & { fail_existing?: string }) {
        return razorpay.customers.create(customer);
    }
}

export const razorpayClient = new RazorpayClient();
