'use server';

import { API_BASE_URL } from "../api";
import { fetcher } from "@/utils/fetcher";

// get all claimed users (with pagination + optional search)
export const getAllClaimed = async (page = 1, limit = 20, searchTerm = '') => {
    try {
        // Build query string
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (searchTerm?.trim()) {
            params.append('search', searchTerm.trim());
        }

        const response = await fetcher(`/auth/get-claimed-users?${params.toString()}`, {
            baseUrl: API_BASE_URL,
            cacheStrategy: "no-cache",
        });

        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during users fetching.";
        return { data: null, error: errorMessage };
    }
};
