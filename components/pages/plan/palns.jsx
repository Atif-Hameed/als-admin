'use client';
import { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { toast } from 'react-hot-toast';
import { togglePlanStatus, updatePlan } from '@/app/actions/plans';
import PlanForm from './plan-form';
import Modal from '@/components/shared/modal';
import Button from '@/components/shared/custom-btn';
import { useRouter } from 'next/navigation';

const PricingPlans = ({ plans: initialPlans, onPlanUpdate }) => {
    const [plans, setPlans] = useState(initialPlans);
    const [showOptions, setShowOptions] = useState(null);
    const [editPlan, setEditPlan] = useState(null);
    const [planToDeactivate, setPlanToDeactivate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showYearly, setShowYearly] = useState(false);
    const router = useRouter();
    const optionsRef = useRef(null);

    // Sync plans with initialPlans when it changes
    useEffect(() => {
        setPlans(initialPlans);
    }, [initialPlans]);

    // Handle click outside to close options dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditClick = (plan) => {
        setEditPlan(plan);
        setShowOptions(null);
    };

    const handleDeactivateClick = (plan) => {
        setPlanToDeactivate(plan);
        setShowOptions(null);
    };

    const handleUpdatePlan = async (updatedData) => {
        setIsSubmitting(true);
        try {
            const { data, error } = await updatePlan(editPlan._id, updatedData);

            if (error) {
                throw new Error(error);
            }

            // Update local state
            setPlans(plans.map(p => (p._id === data._id ? data : p)));

            if (onPlanUpdate) onPlanUpdate();

            setEditPlan(null);
            toast.success('Plan updated successfully');
            router.refresh();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDeactivate = async () => {
        setIsSubmitting(true);
        try {
            const { data, error } = await togglePlanStatus(planToDeactivate._id);

            if (error) {
                throw new Error(error);
            }

            // Update local state
            setPlans(plans.map(p => (p._id === data._id ? data : p)));

            if (onPlanUpdate) onPlanUpdate();

            setPlanToDeactivate(null);
            toast.success(`Plan ${data.isActive ? 'activated' : 'deactivated'} successfully`);
            router.refresh();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPlans = plans.filter(plan => {
        if (showYearly) {
            return plan.interval === 'year';
        }
        return plan.interval === 'month';
    });

    return (
        <div className="p-6 bg-white rounded-lg text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#02315A] mb-8">Plans & Pricing</h2>

            {/* Toggle switch for monthly/yearly */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <span className="text-xl font-medium text-gray-700">Monthly</span>
                <button
                    type="button"
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${showYearly ? 'bg-[#1e3264]' : 'bg-gray-200'}`}
                    onClick={() => setShowYearly(!showYearly)}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${showYearly ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
                <span className="text-xl font-medium text-gray-700">Yearly (30% off)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                {filteredPlans.map((plan, idx) => {
                    const isFeaturedPlan = plan.isActive && plan.isFeatured && filteredPlans.length > 1;
                    const isStandardPlan = plan.isActive && plan.name.includes('Standard') && filteredPlans.length > 1;

                    return (
                        <div
                            key={plan._id}
                            className={`rounded-xl shadow-lg py-6 px-4 flex flex-col justify-between relative ${isFeaturedPlan || isStandardPlan ? 'lg:-my-8' : ''} ${plan.isActive ? 'bg-[#f5f8ff]' : 'bg-gray-100 opacity-75'}`}
                        >
                            <div className="relative">
                                <button
                                    className="absolute right-0 cursor-pointer top-0"
                                    onClick={() => setShowOptions(showOptions === plan._id ? null : plan._id)}
                                >
                                    <BsThreeDotsVertical />
                                </button>

                                {/* Options dropdown */}
                                {showOptions === plan._id && (
                                    <div ref={optionsRef} className="absolute right-0 top-8 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                        <div className="py-1">
                                            <button
                                                className="flex items-center px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                onClick={() => handleEditClick(plan)}
                                            >
                                                <FiEdit2 className="mr-2" /> Edit
                                            </button>
                                            <button
                                                className="flex items-center cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                onClick={() => handleDeactivateClick(plan)}
                                            >
                                                {plan.isActive ? <FiTrash2 className="mr-2" /> : <FiCheckCircle className="mr-2" />}
                                                {plan.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className='flex items-center gap-3 mb-6'>
                                    <h3 className="text-xl font-semibold text-[#1e3264] text-left">
                                        {plan.name.replace('(Monthly)', '').replace('(Yearly)', '').trim()}
                                    </h3>
                                    <p className="text-sm font-bold text-[#1e3264]">
                                        ${Math.round(plan.price)}
                                        <span className="text-sm font-normal">/{plan.interval}</span>
                                    </p>
                                    {!plan.isActive && (
                                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                            Deactivated
                                        </span>
                                    )}
                                </div>

                                <ul className="text-left space-y-3 text-sm text-gray-700">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <div className='bg-[#000C661A] rounded-full p-1'>
                                                <svg width="14" height="12" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.25 9.875L8.25 16.875L18.75 1.125" stroke="#02315A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Plan Modal */}
            <Modal isOpen={editPlan} onClose={() => setEditPlan(null)} >
                <div className="bg-white p-3 rounded-lg w-full">
                    <h3 className="text-xl font-bold mb-4">Edit Plan</h3>
                    <PlanForm
                        initialData={editPlan}
                        onSubmit={handleUpdatePlan}
                        onCancel={() => setEditPlan(null)}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </Modal>

            {/* Deactivate/Activate Confirmation Modal */}
            <Modal isOpen={planToDeactivate} onClose={() => setPlanToDeactivate(null)} modalClass={'xl:!w-[30%] md:!w-[40%] sm:!w-[60%] !w-[80%]'}>
                <div className="bg-white p-4 rounded-lg w-full">
                    <h3 className="text-xl text-center font-bold mb-4">
                        Are you sure you want to {planToDeactivate?.isActive ? 'deactivate' : 'activate'} this plan?
                    </h3>
                    <div className="flex justify-end gap-3 w-full">
                        <Button
                            onClick={() => setPlanToDeactivate(null)}
                            style="px-4 py-2 cursor-pointer border border-gray-300 !w-full rounded-md bg-gray-300"
                            disabled={isSubmitting}
                            label='Cancel'
                        />
                        <Button
                            onClick={handleConfirmDeactivate}
                            style={`px-4 py-2 ${planToDeactivate?.isActive ? 'bg-red-600' : 'bg-green-600'} cursor-pointer text-white !w-full rounded-md`}
                            disabled={isSubmitting}
                            label={planToDeactivate?.isActive ? 'Deactivate' : 'Activate'}
                            loading={isSubmitting}
                            loadingLabel={planToDeactivate?.isActive ? 'Deactivating...' : 'Activating...'}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PricingPlans;