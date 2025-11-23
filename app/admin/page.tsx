'use client';

import { useEffect, useState } from 'react';

interface AdminStats {
    totalUsers: number;
    totalTenants: number;
    totalAffiliates: number;
    totalRevenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
                        <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tenants</h3>
                        <p className="text-3xl font-bold">{stats?.totalTenants || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Affiliates</h3>
                        <p className="text-3xl font-bold">{stats?.totalAffiliates || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}


