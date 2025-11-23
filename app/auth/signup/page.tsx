'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        tenantName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create account');
                return;
            }

            router.push('/auth/login?registered=true');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .pulse-bg {
                    animation: pulse 4s ease-in-out infinite;
                }
            `}</style>

            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'pulse 4s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'pulse 4s ease-in-out infinite',
                animationDelay: '2s'
            }}></div>

            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '480px',
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                padding: '48px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(20px)'
            }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '12px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Create your account
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginTop: '8px'
                    }}>
                        Or{' '}
                        <Link href="/auth/login" style={{
                            color: '#60a5fa',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                        >
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            color: '#fca5a5',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label htmlFor="name" style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#111111',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#374151';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#111111',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#374151';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#111111',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#374151';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="tenantName" style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Organization Name <span style={{ color: '#6b7280', fontWeight: '400' }}>(Optional)</span>
                            </label>
                            <input
                                id="tenantName"
                                name="tenantName"
                                type="text"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#111111',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="My Company"
                                value={formData.tenantName}
                                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#374151';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: loading 
                                ? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: loading 
                                ? 'none'
                                : '0 10px 30px rgba(59, 130, 246, 0.3)',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                            }
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '24px 0',
                        gap: '12px'
                    }}>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: '#374151'
                        }}></div>
                        <span style={{
                            color: '#6b7280',
                            fontSize: '14px'
                        }}>OR</span>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: '#374151'
                        }}></div>
                    </div>

                    {/* OAuth Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#111111',
                                border: '1px solid #374151',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#4285f4';
                                e.currentTarget.style.background = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#374151';
                                e.currentTarget.style.background = '#111111';
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
