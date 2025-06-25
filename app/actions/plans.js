'use server';
import { fetcher } from "@/utils/fetcher";
import { API_URL } from "../api";
import { revalidatePath } from "next/cache";

// Create a new plan
export const createPlan = async (data) => {
    try {
        const response = await fetcher(
            `${API_URL}/api/create-plan`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred during plan creation.";
        return { data: null, error: errorMessage };
    }
};

// Update an existing plan
export const updatePlan = async (id, data) => {
    try {
        const response = await fetcher(
            `${API_URL}/api/update-plan/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
                cacheStrategy: 'no-cache'
            }
        );
        revalidatePath('/admin/plan');
        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred during plan update.";
        return { data: null, error: errorMessage };
    }
};

// Get all plans
export const getAllPlans = async () => {
    try {
        const response = await fetcher(
            `${API_URL}/api/all-plan`,
            {
                method: 'GET',
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response.plans, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred while fetching plans.";
        return { data: null, error: errorMessage };
    }
};

// Get plan by ID
export const getPlanById = async (id) => {
    try {
        const response = await fetcher(
            `${API_URL}/api/get-plan/${id}`,
            {
                method: 'GET',
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response.plan, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred while fetching the plan.";
        return { data: null, error: errorMessage };
    }
};

// Deactivate or active plan
export const togglePlanStatus = async (id) => {
    try {
        const response = await fetcher(
            `${API_URL}/api/deactivate-plan/${id}`,
            {
                method: 'PATCH',
                cacheStrategy: 'no-cache'
            }
        );
        revalidatePath('/admin/plan');
        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred while deactivating the plan.";
        return { data: null, error: errorMessage };
    }
};