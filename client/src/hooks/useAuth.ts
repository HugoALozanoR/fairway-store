import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();

  const login = useCallback(
    async (payload: LoginRequest) => {
      const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
      setSession(data.accessToken, data.user);
      queryClient.invalidateQueries();
      return data.user;
    },
    [setSession, queryClient]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const { data } = await api.post<AuthResponse>(
        "/api/auth/register",
        payload
      );
      setSession(data.accessToken, data.user);
      queryClient.invalidateQueries();
      return data.user;
    },
    [setSession, queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // swallow — we still clear locally
    }
    clear();
    queryClient.clear();
  }, [clear, queryClient]);

  return {
    user,
    isAuthenticated: !!accessToken && !!user,
    isAdmin: user?.role === "Admin",
    login,
    register,
    logout,
  };
}
