// services/userService.ts
import { LoginResponse } from "../types/LoginResponse"; //Este continene el token
import { User } from "../types/user"; //Este contiene la interfaz de usuario
import axios from "axios";

//const API_URL = "http://localhost:5000/api/users"; // Asegura que sea tu URL correcta
const API_URL = "https://back-code-journey.vercel.app/api/users"; //para el deploy

// Login
export const loginUser = async (
    email: string,
    password: string
): Promise<LoginResponse | { error: string }> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Error específico del servidor
            if (error.response?.data?.error) {
                return { error: error.response.data.error };
            }
            // Error de red o servidor
            if (error.response?.status === 400) {
                return { error: "Credenciales incorrectas" };
            }
        }
        return { error: "Error al intentar iniciar sesión" };
    }
};


//Register 
export const registerUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data.user as User; // Asegúrate de que el servidor devuelve un objeto con la propiedad 'user'
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
};


//profile
export const getUserProfile = async (token: string): Promise<User | null> => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Corregimos el acceso a los datos ya que el servidor devuelve { user: User }
        return response.data.user as User;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

//Validar que el email no este registrado
export const validateEmail = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URL}/validate-email`, { email });
        return response.data as boolean;
    } catch (error) {
        console.error("Error validating email:", error);
        return false;
    }
};

//Actualizar usuario
export const updateUser = async (token: string, userId: string, userData: Partial<User>): Promise<User | null> => {
    try {
        const response = await axios.put(`${API_URL}/update/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
};

