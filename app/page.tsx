'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '48px',
            height: '48px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '24px', color: '#e0e0e0', fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .pulse-slow { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '80px 24px'
      }}>
        <main style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto'
        }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              marginBottom: '24px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
              borderRadius: '9999px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#60a5fa',
                letterSpacing: '0.5px'
              }}>🚀 Instagram Automation</span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: '800',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}>
              Instagram Automation
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Platform</span>
          </h1>
            
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#d1d5db',
              marginBottom: '48px',
              maxWidth: '700px',
              margin: '0 auto 48px',
              lineHeight: '1.6'
            }}>
              Automate your Instagram DMs, manage multiple accounts, and scale your business with{' '}
              <span style={{ color: '#60a5fa', fontWeight: '600' }}>intelligent reply automation</span>.
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '100px'
            }}>
              <Link
                href="/auth/signup"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '18px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(59, 130, 246, 0.4)';
                }}
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  background: '#111111',
                  color: '#ffffff',
                  border: '2px solid #374151',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '18px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#60a5fa';
                  e.currentTarget.style.background = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#374151';
                  e.currentTarget.style.background = '#111111';
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '80px'
          }}>
            {/* Auto Replies Card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid #1f2937',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#1f2937';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '12px'
              }}>Auto Replies</h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Set up intelligent automated responses to your Instagram DMs with AI-powered context understanding
              </p>
            </div>

            {/* Multi-Account Card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid #1f2937',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#9333ea';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(147, 51, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#1f2937';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
              }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '12px'
              }}>Multi-Account</h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Manage multiple Instagram accounts from one unified dashboard with seamless switching
          </p>
        </div>

            {/* Analytics Card */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid #1f2937',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#06b6d4';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(6, 182, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#1f2937';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)'
              }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '12px'
              }}>Analytics</h3>
              <p style={{
                color: '#9ca3af',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                Track your engagement, automation performance, and growth metrics with detailed insights
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: '#9ca3af',
              marginBottom: '24px',
              fontSize: '18px'
            }}>Ready to automate your Instagram presence?</p>
            <Link
              href="/auth/signup"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.3)';
              }}
            >
              Start Free Trial →
            </Link>
        </div>
      </main>
      </div>
    </div>
  );
}
