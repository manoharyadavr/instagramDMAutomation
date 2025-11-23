'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState(session?.user?.name || '');
    const [notifications, setNotifications] = useState({
        emailComments: true,
        weeklyReports: true,
        marketing: false,
    });

    const handleSave = async () => {
        setSaving(true);
        // TODO: Implement save functionality
        setTimeout(() => {
            setSaving(false);
            alert('Settings saved!');
        }, 1000);
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
                Settings
            </h1>
            <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginBottom: '32px'
            }}>
                Manage your account settings and preferences
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Profile Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span>👤</span>
                        Profile
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#111111',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '10px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#e5e7eb',
                                marginBottom: '8px'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={session?.user?.email || ''}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '10px',
                                    color: '#6b7280',
                                    fontSize: '15px',
                                    cursor: 'not-allowed',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <p style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                marginTop: '6px',
                                margin: '6px 0 0 0'
                            }}>
                                Email cannot be changed
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                padding: '14px 28px',
                                background: saving
                                    ? 'rgba(107, 114, 128, 0.2)'
                                    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                alignSelf: 'flex-start',
                                opacity: saving ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!saving) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!saving) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span>🔔</span>
                        Notifications
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { key: 'emailComments', label: 'Email notifications for new comments', icon: '💬' },
                            { key: 'weeklyReports', label: 'Weekly usage reports', icon: '📊' },
                            { key: 'marketing', label: 'Marketing emails', icon: '📧' },
                        ].map((item) => (
                            <label
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({
                                        ...notifications,
                                        [item.key]: e.target.checked
                                    })}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer',
                                        accentColor: '#3b82f6'
                                    }}
                                />
                                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                <span style={{
                                    color: '#e5e7eb',
                                    fontSize: '15px',
                                    flex: 1
                                }}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#fca5a5',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span>⚠️</span>
                        Danger Zone
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                    alert('Account deletion not implemented yet');
                                }
                            }}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#fca5a5',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                alignSelf: 'flex-start'
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
                            Delete Account
                        </button>
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            margin: 0
                        }}>
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
