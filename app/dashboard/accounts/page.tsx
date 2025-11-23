'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InstagramAccount {
    id: number;
    instagramId: string;
    username: string;
    enableAutoReply: boolean;
    connectedAt: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get('error');
        if (errorParam) {
            if (errorParam === 'auth_failed') {
                setError('Failed to authenticate with Instagram. Please check your Facebook App configuration.');
            } else if (errorParam === 'domain_not_allowed') {
                setError('Facebook App domain configuration error. Please add the redirect URI to your Facebook App settings.');
            }
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }

        async function fetchAccounts() {
            try {
                const response = await fetch('/api/instagram/accounts');
                if (response.ok) {
                    const data = await response.json();
                    setAccounts(data.accounts || []);
                }
            } catch (error) {
                console.error('Failed to fetch accounts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAccounts();
    }, []);

    const handleConnect = async () => {
        try {
            // Check if user is authenticated first
            const sessionCheck = await fetch('/api/auth/session');
            if (!sessionCheck.ok) {
                window.location.href = '/auth/login';
                return;
            }
            
            const sessionData = await sessionCheck.json();
            if (!sessionData?.user) {
                window.location.href = '/auth/login';
                return;
            }

            // Redirect to Instagram OAuth
            window.location.href = '/api/auth/instagram';
        } catch (error) {
            console.error('Error connecting Instagram:', error);
            alert('Failed to connect Instagram account. Please try again.');
        }
    };

    const toggleAutoReply = async (accountId: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/instagram/accounts/${accountId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enableAutoReply: !currentStatus }),
            });

            if (response.ok) {
                setAccounts(accounts.map(acc =>
                    acc.id === accountId ? { ...acc, enableAutoReply: !currentStatus } : acc
                ));
            }
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    return (
        <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            minHeight: '100vh'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
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
                        Instagram Accounts
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#9ca3af',
                        margin: 0
                    }}>
                        Manage your connected Instagram Business accounts
                    </p>
                </div>
                <button
                    onClick={handleConnect}
                    style={{
                        padding: '14px 28px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                    }}
                >
                    + Connect Account
                </button>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    color: '#fca5a5'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px'
                    }}>
                        <span style={{ fontSize: '24px' }}>⚠️</span>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#fca5a5',
                                margin: '0 0 8px 0'
                            }}>
                                Configuration Required
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#fca5a5',
                                margin: '0 0 12px 0',
                                lineHeight: '1.5'
                            }}>
                                {error}
                            </p>
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                color: '#e5e7eb',
                                marginTop: '12px'
                            }}>
                                <strong>⚠️ Meta requires HTTPS - Use Ngrok:</strong>
                                <ol style={{ margin: '8px 0 0 20px', padding: 0, lineHeight: '1.8' }}>
                                    <li>Install ngrok: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>npm install -g ngrok</code></li>
                                    <li>Start ngrok: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>ngrok http 3000</code></li>
                                    <li>Copy your ngrok HTTPS URL (e.g., <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>https://abc123.ngrok-free.app</code>)</li>
                                    <li>Update <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>NEXTAUTH_URL</code> in <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> to your ngrok URL</li>
                                    <li>Go to <a href="https://developers.facebook.com/apps/1179532514269250/settings/basic/" target="_blank" rel="noopener" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Facebook App Settings</a></li>
                                    <li>Add ngrok domain (without https://) to <strong>App Domains</strong></li>
                                    <li>Add <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/auth/instagram/callback</code> to <strong>Valid OAuth Redirect URIs</strong></li>
                                    <li>Restart dev server and access via ngrok URL</li>
                                </ol>
                                <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                                    See <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>docs/INSTAGRAM_OAUTH_SETUP.md</code> for detailed instructions
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fca5a5',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '0',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

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
                    <p style={{ marginTop: '16px', fontSize: '16px' }}>Loading accounts...</p>
                </div>
            ) : accounts.length === 0 ? (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    padding: '80px 40px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📱</div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '12px'
                    }}>
                        No Instagram accounts connected
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: '#9ca3af',
                        marginBottom: '32px'
                    }}>
                        Connect your first Instagram Business account to get started with automation
                    </p>
                    <button
                        onClick={handleConnect}
                        style={{
                            padding: '16px 32px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                        }}
                    >
                        Connect Your First Account
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            style={{
                                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.2)';
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
                                justifyContent: 'space-between',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        📱
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#ffffff',
                                            margin: 0
                                        }}>
                                            @{account.username}
                                        </h3>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: '4px 0 0 0'
                                        }}>
                                            {account.instagramId}
                                        </p>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: account.enableAutoReply
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(107, 114, 128, 0.2)',
                                    color: account.enableAutoReply ? '#10b981' : '#9ca3af',
                                    border: `1px solid ${account.enableAutoReply ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`
                                }}>
                                    {account.enableAutoReply ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            
                            <p style={{
                                fontSize: '13px',
                                color: '#9ca3af',
                                marginBottom: '20px',
                                paddingBottom: '20px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                Connected: {new Date(account.connectedAt).toLocaleDateString()}
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={() => toggleAutoReply(account.id, account.enableAutoReply)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: `1px solid ${account.enableAutoReply ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: account.enableAutoReply
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : 'rgba(16, 185, 129, 0.1)',
                                        color: account.enableAutoReply ? '#fca5a5' : '#86efac'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = '0.8';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = '1';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {account.enableAutoReply ? 'Disable Auto-Reply' : 'Enable Auto-Reply'}
                                </button>
                                <Link
                                    href={`/dashboard/accounts/${account.id}`}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        color: '#60a5fa',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                    }}
                                >
                                    Manage Account
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
