import { getAllPlans } from '@/app/actions/plans';
import PricingPlans from '@/components/pages/plan/palns'
import React from 'react'

const page = async () => {

    const { data, error } = await getAllPlans();

    if (error) {
        return (
            <div>
                <h1 className='text-2xl text-center py-60'>Soemthing went wrong, please try again!</h1>
            </div>
        )

    }

    return (
        <div>
            <PricingPlans plans={data} />
        </div>
    )
}

export default page
