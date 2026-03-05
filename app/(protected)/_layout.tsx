import { Stack } from 'expo-router';
import React from 'react';

export default function ProtectedLayout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="addItem" options={{
                presentation: 'card',
                animation: 'fade',
                headerShown: false
            }} />
        </Stack>
    );
}
