'use server'
import axios from "axios";
import { API_URL } from "../api";

// Admin Sign Up
export const adminSignUp = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/create-admin`,
            data
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during admin registration.";
        return { data: null, error: errorMessage };
    }
};

// Admin Login
export const adminLogin = async (data) => {
    console.log(data)
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/admin-login`,
            data
        );

        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during admin login.";
        return { data: null, error: errorMessage };
    }
};

// Forgot Password
export const adminForgotPassword = async (email) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/admin-forgot-pass`,
            { email }
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while processing forgot password request.";
        return { data: null, error: errorMessage };
    }
};

// Reset Password
export const adminResetPassword = async (token, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/admin-reset-pass/${token}`,
            { password }
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while resetting password.";
        return { data: null, error: errorMessage };
    }
};

// Get Admin Profile
export const getAdminProfile = async (adminId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/auth/get-admin/${adminId}`,
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred while fetching admin profile.";
        return { data: null, error: errorMessage };
    }
};

