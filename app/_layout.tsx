import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="addItem"
                options={{
                    presentation: 'card',
                    animation: 'fade',
                    headerShown: false
                }}
            />
        </Stack>
    );
}
