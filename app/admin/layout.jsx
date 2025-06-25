'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';



export default function UserLayout({ children }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    useEffect(() => {
        const storeToken = localStorage.getItem('adminToken');

        if (!storeToken) {
            router.replace('/login'); // redirect if token is missing
        } else {
            setLoading(false); // allow rendering
        }
    }, [router]);



    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="flex min-h-screen w-full  gap-5 bg-[#F4F9FD]  ">

            <div className="fixed hidden md:block h-screen p-6 z-40">
                <Sidebar setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            </div>

            <div className={`w-full lg:ml-[219px] relative md:ml-[110px] `}>
                <div className="sticky top-0 z-20 bg-[#F4F9FD] w-full p-6"><Navbar/></div>

                <div className="px-6 overflow-auto mb-3 h-[calc(100%-100px)]">{children}</div>
            </div>
        </div>
    );
}
