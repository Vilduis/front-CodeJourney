"use client";

import { createContext, useState, useEffect, useRef, ReactNode } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { revalidatePosts } from "@/app/actions";
import {
  loginUser as loginService,
  logoutUser as logoutService,
  getUserProfile,
  updateUser as updateUserService,
} from "@/services/userService";
import { User } from "@/types/user";

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  loginUser: (email: string, password: string) => Promise<string | null>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  logoutUser: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const isUnauthorized = (error: unknown) => isAxiosError(error) && error.response?.status === 401;

const isTransient = (error: unknown) =>
  isAxiosError(error) && (!error.response || error.response.status >= 500);

const fetchProfileWithRetry = () =>
  getUserProfile().catch(async (error) => {
    if (!isTransient(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return getUserProfile();
  });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(undefined, (error) => {
      if (isUnauthorized(error) && statusRef.current === "authenticated") {
        setUser(null);
        setStatus("unauthenticated");
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    fetchProfileWithRetry()
      .then((profile) => {
        setUser(profile);
        setStatus("authenticated");
      })
      .catch((error) => {
        setStatus("unauthenticated");
        if (!isUnauthorized(error)) toast.error("No se pudo conectar con el servidor");
      });
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      setUser(await loginService(email, password));
      setStatus("authenticated");
      return null;
    } catch (error) {
      return getErrorMessage(error, "No se pudo iniciar sesión");
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user?._id) return false;
    try {
      setUser(await updateUserService(user._id, userData));
      toast.success("Perfil actualizado");
      await revalidatePosts();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo actualizar el perfil"));
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutService();
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo cerrar la sesión"));
      return false;
    }
    setUser(null);
    setStatus("unauthenticated");
    toast.success("Sesión cerrada");
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, status, loginUser, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
