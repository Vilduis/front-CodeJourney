import axios from "axios";

export const api = axios.create();

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return data?.error || data?.errors?.[0]?.msg || fallback;
  }
  return fallback;
};
