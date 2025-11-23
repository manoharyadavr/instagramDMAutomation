'use client';

import { useSession } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();
    
    const getInitials = (name?: string | null, email?: string | null) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return 'U';
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 32px',
            background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Dashboard
            </h1>
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '4px'
                }}>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                    }}>
                        {session?.user?.name || 'User'}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                    }}>
                        {session?.user?.email}
                    </span>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '600',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}>
                    {getInitials(session?.user?.name, session?.user?.email)}
                </div>
            </div>
        </header>
    );
}
