'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams?.get('error') || 'ConfigurationError';
    
    const errorMessages: Record<string, string> = {
        ConfigurationError: 'There is a problem with the server configuration. Please contact support.',
        AccessDenied: 'You do not have permission to sign in. This may be due to a database connection issue or missing environment variables.',
        Verification: 'The verification token has expired or has already been used.',
        Default: 'An error occurred during authentication. Please try again.',
    };

    const errorMessage = errorMessages[error] || errorMessages.Default;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                padding: '48px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(20px)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '24px'
                }}>⚠️</div>
                
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fca5a5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Access Denied
                </h1>
                
                <p style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                }}>
                    {errorMessage}
                </p>

                {error === 'AccessDenied' && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        textAlign: 'left'
                    }}>
                        <h3 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#fca5a5',
                            marginBottom: '12px'
                        }}>
                            Common causes:
                        </h3>
                        <ul style={{
                            fontSize: '13px',
                            color: '#d1d5db',
                            margin: 0,
                            paddingLeft: '20px',
                            lineHeight: '1.8'
                        }}>
                            <li>Database connection not configured in Vercel</li>
                            <li>Missing or incorrect DATABASE_URL environment variable</li>
                            <li>Missing NEXTAUTH_URL or NEXTAUTH_SECRET</li>
                            <li>Google OAuth redirect URI mismatch</li>
                        </ul>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <Link
                        href="/auth/login"
                        style={{
                            display: 'block',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
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
                        Try Again
                    </Link>
                    
                    <Link
                        href="/"
                        style={{
                            display: 'block',
                            padding: '14px',
                            background: 'transparent',
                            color: '#9ca3af',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#9ca3af';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ErrorPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#ffffff' }}>Loading...</div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
}

