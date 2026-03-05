export type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    isHydrated: boolean;
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}