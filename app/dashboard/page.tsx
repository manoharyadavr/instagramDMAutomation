'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface DashboardStats {
    accounts: number;
    automations: number;
    templates: number;
    repliesToday: number;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            minHeight: '100vh'
        }}>
            <div style={{ marginBottom: '32px' }}>
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
                    Welcome back{mounted && session?.user?.name ? `, ${session.user.name}` : ''}! 👋
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    margin: 0
                }}>
                    Here&apos;s what&apos;s happening with your Instagram automation today.
                </p>
            </div>

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
                    <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        {[
                            { label: 'Instagram Accounts', value: stats?.accounts || 0, link: '/dashboard/accounts', icon: '📱', color: '#3b82f6' },
                            { label: 'Templates', value: stats?.templates || 0, link: '/dashboard/templates', icon: '📝', color: '#8b5cf6' },
                            { label: 'Automations This Month', value: stats?.automations || 0, icon: '⚡', color: '#06b6d4' },
                            { label: 'Replies Today', value: stats?.repliesToday || 0, icon: '💬', color: '#10b981' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = stat.color + '40';
                                    e.currentTarget.style.boxShadow = `0 12px 40px ${stat.color}20`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '100px',
                                    height: '100px',
                                    background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                                    borderRadius: '50%'
                                }}></div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px'
                                }}>
                                    <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `${stat.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>{stat.icon}</div>
                                </div>
                                <h3 style={{
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#9ca3af',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {stat.label}
                                </h3>
                                <p style={{
                                    fontSize: '36px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    margin: '0 0 12px 0',
                                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {stat.value}
                                </p>
                                {stat.link && (
                                    <Link
                                        href={stat.link}
                                        style={{
                                            fontSize: '13px',
                                            color: stat.color,
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        Manage {stat.label.toLowerCase()} →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions and Recent Activity */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '24px'
                    }}>
                        {/* Quick Actions */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '28px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span>⚡</span>
                                Quick Actions
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { href: '/dashboard/accounts', title: 'Connect Instagram Account', desc: 'Link your Instagram Business account to get started', icon: '🔗' },
                                    { href: '/dashboard/templates', title: 'Create Reply Template', desc: 'Set up automated reply messages', icon: '📝' },
                                    { href: '/dashboard/billing', title: 'View Subscription', desc: 'Manage your billing and subscription', icon: '💳' },
                                ].map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        style={{
                                            display: 'block',
                                            padding: '20px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                            <span style={{ fontSize: '24px' }}>{action.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    fontSize: '15px',
                                                    fontWeight: '600',
                                                    color: '#ffffff',
                                                    margin: '0 0 4px 0'
                                                }}>
                                                    {action.title}
                                                </h3>
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: '#9ca3af',
                                                    margin: 0
                                                }}>
                                                    {action.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '28px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span>📊</span>
                                Recent Activity
                            </h2>
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                                <p style={{ margin: 0 }}>No recent activity</p>
                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#4b5563' }}>
                                    Your activity will appear here
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
