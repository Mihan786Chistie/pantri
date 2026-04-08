import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { syncService } from './sync.service';

export const SyncManager = () => {
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (accessToken) {
            syncService.sync();
        }
    }, [accessToken]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && accessToken) {
                syncService.sync();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [accessToken]);

    return null;
};
