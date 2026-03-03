import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { create } from "zustand";


type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    isHydrated: boolean;
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isHydrated: false,

    setTokens: async (accessToken, refreshToken) => {
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        set({ accessToken, refreshToken });
    },

    logout: async () => {
        const accessToken = useAuthStore.getState().accessToken;
        try {
            if (accessToken) {
                await axios.post(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/auth/signout`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            console.warn("Backend signout failed, clearing local state anyway:", error);
        } finally {
            await SecureStore.deleteItemAsync('refreshToken');
            set({ accessToken: null, refreshToken: null });
        }
    },

    hydrate: async () => {
        const refresh = await SecureStore.getItemAsync('refreshToken')

        if (!refresh) {
            set({
                isHydrated: true
            });
            return;
        }

        try {
            const res = await axios.post(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/auth/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${refresh}`
                }
            })
            await SecureStore.setItemAsync("refreshToken", res.data.refreshToken)

            set({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                isHydrated: true,
            })
        } catch {
            await SecureStore.deleteItemAsync("refreshToken")
            set({ accessToken: null, refreshToken: null, isHydrated: true })
        }
    }
}));