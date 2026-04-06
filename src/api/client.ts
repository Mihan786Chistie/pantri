import axios from "axios";
import { useAuthStore } from "../features/auth/store/auth.store";
import { AuthResponse } from "../features/auth/types";

let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.endsWith('/users')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;
                if (!refreshToken) {
                    await useAuthStore.getState().logout();
                    return Promise.reject(error);
                }

                const res = await axios.post<AuthResponse>(
                    `${process.env.EXPO_PUBLIC_API_ENDPOINT}/auth/refresh`,
                    {},
                    { headers: { Authorization: `Bearer ${refreshToken}` } }
                );

                const { accessToken, refreshToken: newRefreshToken } = res.data;
                const user = useAuthStore.getState().user;

                if (user) {
                    await useAuthStore.getState().setTokens(accessToken, newRefreshToken, user);
                }

                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);