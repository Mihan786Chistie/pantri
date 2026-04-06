import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../../api/auth";
import { api } from "../../../api/client";
import { useAuthStore } from "../store/auth.store";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

export const useLoginMutation = () => {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (req: LoginRequest) => authApi.login(req),
        onSuccess: async (data: AuthResponse) => {
            const profileRes = await api.get("/users/profile", {
                headers: { Authorization: `Bearer ${data.accessToken}` }
            });
            const userProfile = profileRes.data;

            await setTokens(data.accessToken, data.refreshToken, {
                id: data.id,
                name: userProfile.name,
                email: userProfile.email
            });
        },
    });
};

export const useRegisterMutation = () => {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (req: RegisterRequest) => authApi.register(req),
        onSuccess: async (data: User, req: RegisterRequest) => {
            const res = await authApi.login({ email: req.email, password: req.password });

            await setTokens(res.accessToken, res.refreshToken, {
                id: res.id,
                name: req.name,
                email: req.email,
            });
        },
    });
};
