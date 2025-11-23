'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

function InstagramCompleteForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    useEffect(() => {
        if (!token) {
            router.push('/auth/login?error=invalid_token');
            return;
        }

        // Redirect to API route to complete login
        fetch(`/api/auth/instagram-complete?token=${token}`)
            .then(() => {
                // API route will handle redirect
            })
            .catch((error) => {
                console.error('Complete login error:', error);
                router.push('/auth/login?error=complete_failed');
            });
    }, [token, router]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ color: '#ffffff', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>⏳</div>
                <div>Completing Instagram login...</div>
            </div>
        </div>
    );
}

export default function InstagramCompletePage() {
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
            <InstagramCompleteForm />
        </Suspense>
    );
}

