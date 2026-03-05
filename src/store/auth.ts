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
        await SecureStore.setItemAsync('accessToken', accessToken);
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

        } finally {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            set({ accessToken: null, refreshToken: null });
        }
    },

    hydrate: async () => {
        const [access, refresh] = await Promise.all([
            SecureStore.getItemAsync('accessToken'),
            SecureStore.getItemAsync('refreshToken')
        ]);

        if (!refresh) {
            set({ isHydrated: true });
            return;
        }

        if (access) {
            set({
                accessToken: access,
                refreshToken: refresh,
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
            const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

            await Promise.all([
                SecureStore.setItemAsync("accessToken", newAccess),
                SecureStore.setItemAsync("refreshToken", newRefresh)
            ]);

            set({
                accessToken: newAccess,
                refreshToken: newRefresh,
                isHydrated: true,
            })
        } catch {
            await Promise.all([
                SecureStore.deleteItemAsync("accessToken"),
                SecureStore.deleteItemAsync("refreshToken")
            ]);
            set({ accessToken: null, refreshToken: null, isHydrated: true })
        }
    }
}));