import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { mySync } from './sync';

export const SyncManager = () => {
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (accessToken) {
            mySync().catch(err => console.error("[SyncManager] Initial sync failed:", err));
        }
    }, [accessToken]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && accessToken) {
                mySync().catch(err => console.error("[SyncManager] Foreground sync failed:", err));
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [accessToken]);

    return null;
};
