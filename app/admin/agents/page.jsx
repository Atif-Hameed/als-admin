import { getAllClaimed } from '@/app/actions/users';
import AgentTable from '@/components/pages/agents/agentTable';
import React from 'react'

const page = async ({ searchParams }) => {

    const { page, searchTerm } = await searchParams;

    const { data, error } = await getAllClaimed(page, 20, searchTerm);

    if (error) {
        return (
            <div className='text-center text-xl py-40'>
                Something went wrong!
            </div>
        )
    }

    return (
        <div className=''>
            <AgentTable data={data} />
        </div>
    )
}

export default page
