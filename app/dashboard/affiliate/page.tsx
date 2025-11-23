'use client';

import { useEffect, useState } from 'react';

interface AffiliateStats {
    referralCode: string;
    totalEarnings: number;
    pendingPayout: number;
    totalReferrals: number;
    referralUrl: string;
}

export default function AffiliatePage() {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, leaderboardRes] = await Promise.all([
                    fetch('/api/affiliate/enroll'),
                    fetch('/api/affiliate/leaderboard'),
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data.affiliate || null);
                }

                if (leaderboardRes.ok) {
                    const data = await leaderboardRes.json();
                    setLeaderboard(data.leaderboard || []);
                }
            } catch (error) {
                console.error('Failed to fetch affiliate data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const response = await fetch('/api/affiliate/enroll', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.affiliate);
            }
        } catch (error) {
            console.error('Failed to enroll:', error);
        } finally {
            setEnrolling(false);
        }
    };

    const copyReferralLink = () => {
        if (stats?.referralUrl) {
            navigator.clipboard.writeText(stats.referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                Affiliate Program
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginBottom: '32px'
            }}>
                Earn commissions by referring new users
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
                    <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading affiliate data...</p>
                </div>
            ) : (
                <>
                    {!stats ? (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                            padding: '48px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                            marginBottom: '32px'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤝</div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#ffffff',
                                marginBottom: '12px'
                            }}>
                                Join the Affiliate Program
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#9ca3af',
                                marginBottom: '32px',
                                maxWidth: '500px',
                                margin: '0 auto 32px'
                            }}>
                                Earn 30% commission on every referral! Share your link and start earning today.
                            </p>
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                style={{
                                    padding: '16px 32px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: enrolling ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.3s',
                                    opacity: enrolling ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!enrolling) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!enrolling) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                                    }
                                }}
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                {[
                                    { label: 'Total Earnings', value: `₹${stats.totalEarnings.toFixed(2)}`, icon: '💰', color: '#10b981' },
                                    { label: 'Pending Payout', value: `₹${stats.pendingPayout.toFixed(2)}`, icon: '⏳', color: '#f59e0b' },
                                    { label: 'Total Referrals', value: stats.totalReferrals.toString(), icon: '👥', color: '#3b82f6' },
                                    { label: 'Referral Code', value: stats.referralCode, icon: '🎫', color: '#8b5cf6' },
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                                            padding: '24px',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            transition: 'all 0.3s'
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px'
                                        }}>
                                            <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                                            <h3 style={{
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: '#9ca3af',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                margin: 0
                                            }}>
                                                {stat.label}
                                            </h3>
                            </div>
                                        <p style={{
                                            fontSize: index === 3 ? '20px' : '32px',
                                            fontWeight: '700',
                                            color: stat.color,
                                            margin: 0,
                                            fontFamily: index === 3 ? 'monospace' : 'inherit'
                                        }}>
                                            {stat.value}
                                        </p>
                            </div>
                                ))}
                        </div>

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
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span>🔗</span>
                                    Your Referral Link
                                </h2>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={stats.referralUrl}
                                    readOnly
                                        style={{
                                            flex: 1,
                                            padding: '14px 16px',
                                            background: '#111111',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            fontSize: '14px',
                                            fontFamily: 'monospace'
                                        }}
                                />
                                <button
                                    onClick={copyReferralLink}
                                        style={{
                                            padding: '14px 24px',
                                            background: copied
                                                ? 'rgba(16, 185, 129, 0.2)'
                                                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                            border: copied
                                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                                : 'none',
                                            color: copied ? '#10b981' : '#ffffff',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                                padding: '32px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
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
                                    <span>🏆</span>
                                    Leaderboard
                                </h2>
                        {leaderboard.length === 0 ? (
                                    <div style={{
                                        padding: '40px',
                                        textAlign: 'center',
                                        color: '#6b7280'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                                        <p style={{ margin: 0 }}>No affiliates yet</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    <th style={{
                                                        textAlign: 'left',
                                                        padding: '12px',
                                                        color: '#9ca3af',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>Rank</th>
                                                    <th style={{
                                                        textAlign: 'left',
                                                        padding: '12px',
                                                        color: '#9ca3af',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>Name</th>
                                                    <th style={{
                                                        textAlign: 'left',
                                                        padding: '12px',
                                                        color: '#9ca3af',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>Referrals</th>
                                                    <th style={{
                                                        textAlign: 'left',
                                                        padding: '12px',
                                                        color: '#9ca3af',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((affiliate, idx) => (
                                                    <tr
                                                        key={affiliate.id}
                                                        style={{
                                                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'transparent';
                                                        }}
                                                    >
                                                        <td style={{
                                                            padding: '16px 12px',
                                                            color: idx < 3 ? '#fbbf24' : '#ffffff',
                                                            fontWeight: idx < 3 ? '700' : '500'
                                                        }}>
                                                            #{idx + 1}
                                                        </td>
                                                        <td style={{
                                                            padding: '16px 12px',
                                                            color: '#e5e7eb'
                                                        }}>
                                                            {affiliate.user?.name || affiliate.user?.email || 'N/A'}
                                                        </td>
                                                        <td style={{
                                                            padding: '16px 12px',
                                                            color: '#ffffff',
                                                            fontWeight: '600'
                                                        }}>
                                                            {affiliate.totalReferrals || 0}
                                                        </td>
                                                        <td style={{
                                                            padding: '16px 12px',
                                                            color: '#10b981',
                                                            fontWeight: '600'
                                                        }}>
                                                            ₹{affiliate.totalEarnings?.toFixed(2) || '0.00'}
                                                        </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
