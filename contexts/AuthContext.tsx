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
        toast.error("Tu sesión expiró. Inicia sesión de nuevo.");
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    getUserProfile()
      .then((profile) => {
        setUser(profile);
        setStatus("authenticated");
      })
      .catch((error) => {
        setStatus("unauthenticated");
        if (!isUnauthorized(error)) toast.error("No pudimos conectar con el servidor para recuperar tu sesión");
      });
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      setUser(await loginService(email, password));
      setStatus("authenticated");
      return null;
    } catch (error) {
      const message = getErrorMessage(error, "Error al iniciar sesión");
      toast.error(message);
      return message;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user?._id) return false;
    try {
      setUser(await updateUserService(user._id, userData));
      toast.success("Perfil actualizado exitosamente");
      await revalidatePosts();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al actualizar el perfil"));
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutService();
    } catch (error) {
      toast.error(getErrorMessage(error, "No pudimos cerrar la sesión. Inténtalo de nuevo."));
      return false;
    }
    setUser(null);
    setStatus("unauthenticated");
    toast.success("Sesión cerrada exitosamente");
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, status, loginUser, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
