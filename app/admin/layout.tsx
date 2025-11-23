'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/affiliates', label: 'Affiliates' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/tenants', label: 'Tenants' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">Admin Panel</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {adminNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${
                                            pathname === item.href
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link
                                href="/dashboard"
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

