"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  loginUser as loginService,
  registerUser as registerService,
  getUserProfile as getUserProfileService,
  updateUser as updateUserService,
} from "../services/userService";
import { User } from "../types/user";
import { toast } from "sonner";
import { LoginResponse } from "@/types/LoginResponse";

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  status: AuthStatus;
  error: string | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  logoutUser: () => void;
  refreshUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  status: "loading",
  error: null,
  loginUser: async () => false,
  registerUser: async () => false,
  updateUser: async () => false,
  logoutUser: () => {},
  refreshUserProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await getUserProfileService(authToken);

      if (profile) {
        setUser(profile);
        setStatus("authenticated");
      } else {
        setUser(null);
        setToken(null);
        setStatus("unauthenticated");
        localStorage.removeItem("token");
        toast.error("Sesión expirada");
      }
    } catch {
      setUser(null);
      setToken(null);
      setStatus("unauthenticated");
      setError("Error al obtener el perfil");
      localStorage.removeItem("token");
      toast.error("Error al obtener el perfil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await fetchProfile(storedToken);
        } else {
          setStatus("unauthenticated");
          setIsLoading(false);
        }
      } catch {
        setStatus("unauthenticated");
        setIsLoading(false);
        localStorage.removeItem("token");
      }
    };

    initializeAuth();
  }, [fetchProfile]);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await loginService(email, password);

      if ("error" in response) {
        setError(response.error);
        toast.error(response.error);
        return false;
      }

      const { token: loginToken, user: loggedUser } = response as LoginResponse;
      if (loginToken && loggedUser) {
        localStorage.setItem("token", loginToken);
        setToken(loginToken);
        setUser(loggedUser);
        setStatus("authenticated");
        toast.success("Inicio de sesión exitoso");
        return true;
      }

      setError("Error inesperado al iniciar sesión");
      toast.error("Error inesperado al iniciar sesión");
      return false;
    } catch {
      setError("Error al conectar con el servidor");
      toast.error("Error al conectar con el servidor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await registerService(userData);
      if (res) {
        toast.success("Registro exitoso");
        return true;
      }
      setError("Error en el registro");
      toast.error("Error al registrar usuario");
      return false;
    } catch {
      setError("Error en el registro");
      toast.error("Error al registrar usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token || !user?._id) {
        toast.error("Sesión expirada");
        return false;
      }

      const updatedUser = await updateUserService(token, user._id, userData);

      if (updatedUser) {
        setUser(updatedUser);
        toast.success("Perfil actualizado exitosamente");
        return true;
      }

      setError("Error al actualizar el perfil");
      toast.error("Error al actualizar el perfil");
      return false;
    } catch {
      setError("Error al actualizar el perfil");
      toast.error("Error al actualizar el perfil");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
    toast.success("Sesión cerrada exitosamente");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        status,
        error,
        loginUser,
        registerUser,
        updateUser,
        logoutUser,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
