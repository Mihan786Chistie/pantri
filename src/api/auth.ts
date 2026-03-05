import { AuthResponse, LoginRequest, RefreshRequest, RegisterRequest, User } from "../features/auth/types";
import { api } from "./client";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<User> => {
        const response = await api.post("/users", data);
        return response.data;
    },

    refresh: async (data: RefreshRequest): Promise<AuthResponse> => {
        const response = await api.post("/auth/refresh", data, { headers: { Authorization: `Bearer ${data.refreshToken}` } });
        return response.data;
    },
};
