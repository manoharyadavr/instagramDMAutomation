'use client';

import { useEffect, useState } from 'react';

interface Affiliate {
    id: number;
    referralCode: string;
    totalEarnings: number;
    pendingPayout: number;
    totalReferrals: number;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminAffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchAffiliates() {
            try {
                const response = await fetch(`/api/admin/affiliates?page=${page}&limit=20`);
                if (response.ok) {
                    const data = await response.json();
                    setAffiliates(data.affiliates || []);
                    setTotalPages(data.pagination?.totalPages || 1);
                }
            } catch (error) {
                console.error('Failed to fetch affiliates:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAffiliates();
    }, [page]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Affiliates Management</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Affiliate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referral Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referrals
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Earnings
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pending Payout
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {affiliates.map((affiliate) => (
                                    <tr key={affiliate.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {affiliate.user?.name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">{affiliate.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className="text-sm font-mono">{affiliate.referralCode}</code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {affiliate.totalReferrals || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{affiliate.totalEarnings?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{affiliate.pendingPayout?.toFixed(2) || '0.00'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}


