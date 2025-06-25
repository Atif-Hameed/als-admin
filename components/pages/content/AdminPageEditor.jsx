'use client';
import React from 'react';

import Button from '@/components/shared/custom-btn';
import PagesTable from './pages-table';
import { useRouter } from 'next/navigation';


const Pages = ({ data }) => {

  const router = useRouter();

  return (
    <div className="min-h-screen py-6">
      <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="sm:text-2xl text-xl font-semibold text-gray-800">All Pages</h2>
          <Button
            style="!bg-dark !text-white !px-4 !py-2 rounded-lg"
            label="Create New Page"
            onClick={() => router.push(`/admin/web-pages/create-page`)}
          />
        </div>
        <PagesTable
          pages={data}
        />
      </div>
    </div>
  );
};

export default Pages;