import { LoginResponse } from "../types/LoginResponse";
import { User } from "../types/user";
import axios from "axios";
import config from "@/lib/config";

const API_URL = `${config.apiUrl}${config.api.users}`;

export const loginUser = async (
    email: string,
    password: string
): Promise<LoginResponse | { error: string }> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            if (error.response?.status === 400) {
                return { error: "Credenciales incorrectas" };
            }
        }
        return { error: "Error al intentar iniciar sesión" };
    }
};

export const registerUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data.user as User;
    } catch {
        return null;
    }
};

export const getUserProfile = async (token: string): Promise<User | null> => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.user as User;
    } catch {
        return null;
    }
};

export const validateEmail = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URL}/validate-email`, { email });
        return response.data as boolean;
    } catch {
        return false;
    }
};

export const updateUser = async (token: string, userId: string, userData: Partial<User>): Promise<User | null> => {
    try {
        const response = await axios.put(`${API_URL}/update/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch {
        return null;
    }
};
