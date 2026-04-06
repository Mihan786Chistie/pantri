import { mySync } from "@/src/db/sync/sync";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.userInfo}>
                <Text>Welcome, {user?.name} ({user?.email})</Text>
            </View>

            <Button title="Logout" onPress={logout} color="red" />

            <View style={styles.actionsSection}>
                <Button title="Sync Now" onPress={async () => {
                    try {
                        await mySync();
                        Alert.alert("Success", "Sync completed!");
                    } catch (err: any) {
                        Alert.alert("Sync Error", err.message);
                    }
                }} color="green" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 50 },
    title: { fontWeight: "bold", fontSize: 20 },
    userInfo: { marginVertical: 20 },
    actionsSection: { marginTop: 30 },
});