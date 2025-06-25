'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/shared/pagination';
import React, { useEffect, useState } from 'react';

const AgentTable = ({ data }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { users, pagination } = data;

    const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

    // 🔄 Update search param immediately on input change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
            params.set('searchTerm', searchTerm.trim());
        } else {
            params.delete('searchTerm');
        }

        params.set('page', '1');
        router.push(`?${params.toString()}`);
    }, [searchTerm]);

    // 🔁 Handle pagination
    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page);
        router.push(`?${params.toString()}`);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            {/* 🔍 Live Search Input */}
            <div className="mb-4 flex justify-between items-center gap-4 flex-wrap">
                <h1 className='sm:text-2xl text-xl font-semibold'>All Claimed agents</h1>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, etc."
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 bg-white rounded-md outline-none "
                />
            </div>

            <div className="overflow-x-auto rounded-lg shadow -pb-10 bg-red-500">
                <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-cgreen text-dark font-medium">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-sm uppercase tracking-wider">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                        {users.map((user) => (
                            <tr key={user._id} className=''>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.firstName || user.lastName
                                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                        : user.userName || 'No name provided'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.updatedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AgentTable;