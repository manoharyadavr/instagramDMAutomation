export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number; // in INR
    interval: 'monthly' | 'yearly';
    features: string[];
    limits: {
        automations: number; // max automations per month
        accounts: number; // max IG accounts
        templates: number; // max templates
    };
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    starter: {
        id: 'plan_starter',
        name: 'Starter',
        price: 999,
        interval: 'monthly',
        features: [
            '1 Instagram Account',
            '1000 Automations/month',
            '5 Templates',
            'Email Support',
        ],
        limits: {
            automations: 1000,
            accounts: 1,
            templates: 5,
        },
    },
    pro: {
        id: 'plan_pro',
        name: 'Pro',
        price: 2999,
        interval: 'monthly',
        features: [
            '3 Instagram Accounts',
            '10,000 Automations/month',
            'Unlimited Templates',
            'Priority Support',
            'Advanced Analytics',
        ],
        limits: {
            automations: 10000,
            accounts: 3,
            templates: -1, // unlimited
        },
    },
    business: {
        id: 'plan_business',
        name: 'Business',
        price: 9999,
        interval: 'monthly',
        features: [
            '10 Instagram Accounts',
            '100,000 Automations/month',
            'Unlimited Templates',
            '24/7 Support',
            'Advanced Analytics',
            'Custom Integrations',
        ],
        limits: {
            automations: 100000,
            accounts: 10,
            templates: -1,
        },
    },
};
