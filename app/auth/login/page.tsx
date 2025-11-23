'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (searchParams?.get('registered') === 'true') {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
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
                        Sign in to your account
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginTop: '8px'
                    }}>
                        Or{' '}
                        <Link href="/auth/signup" style={{
                            color: '#60a5fa',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {success && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '12px',
                            color: '#86efac',
                            fontSize: '14px'
                        }}>
                            Account created successfully! Please sign in.
                        </div>
                    )}

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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <label htmlFor="password" style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#e5e7eb'
                                }}>
                                    Password
                                </label>
                                <Link href="/auth/forgot-password" style={{
                                    fontSize: '13px',
                                    color: '#60a5fa',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#93c5fd'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#60a5fa'}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? 'Signing in...' : 'Sign in'}
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
