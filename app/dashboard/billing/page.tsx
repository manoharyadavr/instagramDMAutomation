'use client';

import { useEffect, useState } from 'react';
import { SUBSCRIPTION_PLANS } from '@/lib/razorpay/plans';

interface Subscription {
    id: number;
    planId: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
}

export default function BillingPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [subRes, usageRes] = await Promise.all([
                    fetch('/api/billing/subscriptions'),
                    fetch('/api/billing/usage'),
                ]);

                if (subRes.ok) {
                    const subData = await subRes.json();
                    setSubscription(subData.subscription || null);
                }

                if (usageRes.ok) {
                    const usageData = await usageRes.json();
                    setUsage(usageData);
                }
            } catch (error) {
                console.error('Failed to fetch billing data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSubscribe = async (planId: string) => {
        const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
        if (!plan) return;

        try {
            const response = await fetch('/api/billing/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    customerName: 'User',
                    customerEmail: 'user@example.com',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.razorpaySubscription) {
                    window.location.href = data.razorpaySubscription.short_url;
                }
            }
        } catch (error) {
            console.error('Failed to create subscription:', error);
        }
    };

    const handleCancel = async () => {
        if (!subscription) return;

        if (confirm('Are you sure you want to cancel your subscription?')) {
            try {
                const response = await fetch(`/api/billing/subscriptions/${subscription.id}/cancel`, {
                    method: 'POST',
                });

                if (response.ok) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to cancel subscription:', error);
            }
        }
    };

    return (
        <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            minHeight: '100vh'
        }}>
            <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Billing & Subscription
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginBottom: '32px'
            }}>
                Manage your subscription and view usage
            </p>

            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    color: '#9ca3af'
                }}>
                    <div className="spinner" style={{
                        display: 'inline-block',
                        width: '48px',
                        height: '48px',
                        border: '4px solid #3b82f6',
                        borderTopColor: 'transparent',
                        borderRadius: '50%'
                    }}></div>
                    <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading billing data...</p>
                </div>
            ) : (
                <>
                    {subscription ? (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span>💳</span>
                                Current Subscription
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: '16px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Plan:</span>
                                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                                    {Object.values(SUBSCRIPTION_PLANS).find(p => p.id === subscription.planId)?.name || subscription.planId}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: '16px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Status:</span>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: subscription.status === 'ACTIVE'
                                            ? 'rgba(16, 185, 129, 0.2)'
                                            : 'rgba(107, 114, 128, 0.2)',
                                        color: subscription.status === 'ACTIVE' ? '#10b981' : '#9ca3af',
                                        border: `1px solid ${subscription.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`
                                    }}>
                                        {subscription.status}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Current Period:</span>
                                    <span style={{ color: '#ffffff', fontSize: '14px' }}>
                                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                    </span>
                                </div>
                                {subscription.status === 'ACTIVE' && (
                                    <button
                                        onClick={handleCancel}
                                        style={{
                                            marginTop: '16px',
                                            padding: '12px 24px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#fca5a5',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                        }}
                                    >
                                        Cancel Subscription
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '32px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '8px'
                            }}>
                                No Active Subscription
                            </h2>
                            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                                Choose a plan below to get started
                            </p>
                        </div>
                    )}

                    {usage && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '32px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span>📊</span>
                                Usage This Month
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '24px'
                            }}>
                                {[
                                    { label: 'Automations Used', value: usage.used || 0, color: '#3b82f6' },
                                    { label: 'Automations Limit', value: usage.limit || 0, color: '#8b5cf6' },
                                    { label: 'Remaining', value: usage.remaining || 0, color: '#10b981' },
                                ].map((stat, index) => (
                                    <div key={index} style={{
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        <p style={{
                                            fontSize: '13px',
                                            color: '#9ca3af',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {stat.label}
                                        </p>
                                        <p style={{
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            color: stat.color,
                                            margin: 0
                                        }}>
                                            {stat.value}
                                        </p>
                                </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => {
                            const isCurrent = subscription?.planId === plan.id;
                            const colors = ['#3b82f6', '#8b5cf6', '#06b6d4'];
                            const planColor = colors[index % colors.length];
                            
                            return (
                                <div
                                    key={plan.id}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                                        padding: '32px',
                                        borderRadius: '16px',
                                        border: isCurrent
                                            ? `2px solid ${planColor}`
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isCurrent) {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.borderColor = planColor;
                                            e.currentTarget.style.boxShadow = `0 12px 40px ${planColor}20`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCurrent) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {isCurrent && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            padding: '6px 12px',
                                            background: planColor,
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            Current Plan
                                        </div>
                                    )}
                                    <h3 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#ffffff',
                                        marginBottom: '8px'
                                    }}>
                                        {plan.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '36px',
                                        fontWeight: '800',
                                        color: planColor,
                                        marginBottom: '24px'
                                    }}>
                                        ₹{plan.price}
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: '400',
                                            color: '#9ca3af'
                                        }}>/month</span>
                                    </p>
                                    <ul style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: '0 0 24px 0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                    {plan.features.map((feature, idx) => (
                                            <li key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#e5e7eb',
                                                fontSize: '14px'
                                            }}>
                                                <span style={{ color: planColor }}>✓</span>
                                                {feature}
                                            </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                        disabled={isCurrent}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            background: isCurrent
                                                ? 'rgba(107, 114, 128, 0.2)'
                                                : `linear-gradient(135deg, ${planColor} 0%, ${planColor}dd 100%)`,
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            cursor: isCurrent ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s',
                                            opacity: isCurrent ? 0.5 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCurrent) {
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }
                                        }}
                                    >
                                        {isCurrent ? 'Current Plan' : 'Subscribe'}
                                </button>
                            </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
