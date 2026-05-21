import Item from "@/src/db/model/Item";
import { syncService } from "@/src/db/sync/sync.service";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { EmptyStateIllustration } from "@/src/features/items/components/molecules/EmptyStateIllustration";
import { Database, Q } from "@nozbe/watermelondb";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import React from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";

interface HomeContentProps {
    items: Item[];
}

const HomeContent = ({ items }: HomeContentProps) => {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    if (items.length === 0) {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 48, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <EmptyStateIllustration />
                </ScrollView>
            </View>
        );
    }

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
                        await syncService.sync();
                        Alert.alert("Success", "Sync completed!");
                    } catch (err: any) {
                        Alert.alert("Sync Error", err.message);
                    }
                }} color="green" />
            </View>
        </View>
    );
};

const enhance = withObservables(
    ["userId"],
    ({ database, userId }: { database: Database; userId: string }) => ({
        items: database.get<Item>("items").query(Q.where("user_id", userId)).observe(),
    })
);

const EnhancedHomeContent = enhance(HomeContent);

export default function Index() {
    const user = useAuthStore((s) => s.user);
    const database = useDatabase();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Please log in to continue.</Text>
            </View>
        );
    }

    return <EnhancedHomeContent database={database} userId={user.id} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f3",
        padding: 16,
        paddingTop: 100,
    },
    title: { fontWeight: "bold", fontSize: 20, padding: 50, paddingBottom: 0 },
    userInfo: { marginVertical: 20, paddingHorizontal: 50 },
    actionsSection: { marginTop: 30, paddingHorizontal: 50 },
    emptyText: { color: "#999", fontSize: 14 },
});