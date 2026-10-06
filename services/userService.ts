import { api } from "@/lib/api";
import { User } from "@/types/user";

export const loginUser = async (email: string, password: string) =>
  (await api.post<{ user: User }>("/api/users/login", { email, password })).data.user;

export const logoutUser = async () => {
  await api.post("/api/users/logout");
};

export const registerUser = async (userData: Partial<User>) =>
  (await api.post<{ user: User }>("/api/users/register", userData)).data.user;

export const getUserProfile = async () => (await api.get<{ user: User }>("/api/users/profile")).data.user;

export const isEmailRegistered = async (email: string) =>
  (await api.post<{ isEmailRegistered: boolean }>("/api/users/validate-email", { email })).data.isEmailRegistered;

export const updateUser = async (userId: string, userData: Partial<User>) =>
  (await api.put<User>(`/api/users/update/${userId}`, userData)).data;
