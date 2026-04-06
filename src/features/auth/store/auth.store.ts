import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { create } from "zustand";
import { AuthState } from '../types';

const clearTokens = async () => {
    await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
        SecureStore.deleteItemAsync('user')
    ]);
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isHydrated: false,

    setTokens: async (accessToken, refreshToken, user) => {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        set({ accessToken, refreshToken, user });
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
            console.error(error);
        } finally {
            await clearTokens();
            set({ accessToken: null, refreshToken: null, user: null });
        }
    },

    hydrate: async () => {
        const [access, refresh, userStr] = await Promise.all([
            SecureStore.getItemAsync('accessToken'),
            SecureStore.getItemAsync('refreshToken'),
            SecureStore.getItemAsync('user')
        ]);

        const user = userStr ? JSON.parse(userStr) : null;

        if (!refresh) {
            set({ isHydrated: true });
            return;
        }

        if (access) {
            set({
                accessToken: access,
                refreshToken: refresh,
                user,
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
            const { accessToken: newAccess, refreshToken: newRefresh, user: newUser } = res.data;

            const userData = newUser || user;

            await Promise.all([
                SecureStore.setItemAsync("accessToken", newAccess),
                SecureStore.setItemAsync("refreshToken", newRefresh),
                SecureStore.setItemAsync("user", JSON.stringify(userData))
            ]);

            set({
                accessToken: newAccess,
                refreshToken: newRefresh,
                user: userData,
                isHydrated: true,
            })
        } catch {
            await clearTokens();
            set({ accessToken: null, refreshToken: null, user: null, isHydrated: true })
        }
    }
}));