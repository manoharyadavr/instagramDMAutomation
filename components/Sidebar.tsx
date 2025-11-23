'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/accounts', label: 'Instagram Accounts', icon: '📱' },
    { href: '/dashboard/billing', label: 'Billing', icon: '💳' },
    { href: '/dashboard/affiliate', label: 'Affiliate', icon: '🤝' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    
    return (
        <aside style={{
            width: '280px',
            background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            minHeight: '100vh',
            position: 'sticky',
            top: 0
        }}>
            <div style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '40px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
            }}>
                InstAutomation
            </div>
            
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1
            }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                color: isActive ? '#ffffff' : '#9ca3af',
                                background: isActive 
                                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                                    : 'transparent',
                                border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? '600' : '500',
                                fontSize: '15px',
                                transition: 'all 0.2s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.color = '#e5e7eb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#9ca3af';
                                }
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '4px',
                                    height: '60%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    borderRadius: '0 4px 4px 0'
                                }}></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                style={{
                    marginTop: 'auto',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
            >
                <span>🚪</span>
                <span>Sign Out</span>
            </button>
        </aside>
    );
}
