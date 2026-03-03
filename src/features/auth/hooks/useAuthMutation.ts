import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../../api/auth";
import { useAuthStore } from "../../../store/auth";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

export const useLoginMutation = () => {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (req: LoginRequest) => authApi.login(req),
        onSuccess: async (data: AuthResponse) => {
            await setTokens(data.accessToken, data.refreshToken);
        },
    });
};

export const useRegisterMutation = () => {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (req: RegisterRequest) => authApi.register(req),
        onSuccess: async (data: User, req: RegisterRequest) => {
            const res = await authApi.login({ email: req.email, password: req.password });
            await setTokens(res.accessToken, res.refreshToken);
        },
    });
};
