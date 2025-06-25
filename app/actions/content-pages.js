'use server'
import axios from "axios";
import { API_BASE_URL, API_URL } from "../api";
import { fetcher } from "@/utils/fetcher";

export const createPage = async (data) => {
    try {
        const response = await fetcher(
            '/api/create-page',
            {
                method: 'POST',
                body: JSON.stringify(data),
                baseUrl: API_URL,
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during content page creation.";
        return { data: null, error: errorMessage };
    }
};

export const updatePage = async (data, id) => {
    try {
        const response = await fetcher(
            `/api/update-page/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
                baseUrl: API_URL,
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during content page updation.";
        return { data: null, error: errorMessage };
    }
};

export const deletePage = async (id) => {
    try {
        const response = await fetcher(
            `/api/delete-page/${id}`,
            {
                method: 'DELETE',
                baseUrl: API_URL,
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during content page deletion.";
        return { data: null, error: errorMessage };
    }
};

export const getPageContent = async (slug) => {
    try {
        const response = await fetcher(
            `/get-page/${slug}`,
            {
                baseUrl: API_BASE_URL,
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during page fetching.";
        return { data: null, error: errorMessage };
    }
};

export const getAllPages = async () => {
    try {
        const response = await fetcher(
            '/get-all-pages',
            {
                baseUrl: API_BASE_URL,
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during pages fetching.";
        return { data: null, error: errorMessage };
    }
};