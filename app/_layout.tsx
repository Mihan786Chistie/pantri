import { database } from '@/src/db';
import { SyncManager } from '@/src/db/sync/syncManager';
import { useAuthStore } from '@/src/features/auth/store/auth.store';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

export default function RootLayout() {
    const hydrate = useAuthStore((s) => s.hydrate)
    const isHydrated = useAuthStore((s) => s.isHydrated)
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        hydrate()
    }, [])

    useEffect(() => {
        if (isHydrated) {
            SplashScreen.hideAsync();
        }
    }, [isHydrated]);

    if (!isHydrated) return (
        <View style={{ flex: 1, backgroundColor: '#ffffffff', justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={require('../assets/images/router-icon.png')}
                style={{ width: 200, height: 200 }}
                contentFit="contain"
            />
        </View>
    );

    return (
        <DatabaseProvider database={database}>
            <QueryClientProvider client={queryClient}>
                <SyncManager />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Protected guard={!!accessToken}>
                        <Stack.Screen name="(protected)" options={{
                            animation: "none"
                        }} />
                    </Stack.Protected>
                    <Stack.Protected guard={!accessToken}>
                        <Stack.Screen name="(auth)" options={{
                            animation: "none"
                        }} />
                    </Stack.Protected>
                </Stack>
            </QueryClientProvider>
        </DatabaseProvider>
    );
}