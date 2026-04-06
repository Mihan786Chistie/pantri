import Item from "@/src/db/model/Item";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { deleteItem, updateItem } from "@/src/features/items/services/item.service";
import { Database, Q } from "@nozbe/watermelondb";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import React, { useCallback } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";

interface ItemRowProps {
    item: Item;
}

const ItemRow = ({ item }: ItemRowProps) => {
    const handleDeleteItem = useCallback(async () => {
        try {
            await deleteItem(item);
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    }, [item]);

    const handleConsumeItem = useCallback(async () => {
        try {
            await updateItem(item, { isConsumed: !item.isConsumed });
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    }, [item]);

    return (
        <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                    {item.category}
                    {item.expiresAt
                        ? ` · Expires: ${item.expiresAt.toLocaleDateString()}`
                        : ""}
                    {item.isConsumed ? " · ✅ Consumed" : ""}
                </Text>
            </View>
            <Button
                title="Delete"
                color="red"
                onPress={handleDeleteItem}
            />
            <Button
                title="Done"
                color="blue"
                onPress={handleConsumeItem}
            />
        </View>
    );
};

const EnhancedItemRow = withObservables(['item'], ({ item }: { item: Item }) => ({
    item: item.observe(),
}))(ItemRow);

const PantriList = ({ items }: { items: Item[] }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Pantri</Text>
            <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>
                    Your Items ({items.length}):
                </Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <EnhancedItemRow item={item} />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No items yet. Add some!</Text>
                    }
                />
            </View>
        </View>
    );
};

const enhance = withObservables(['userId'], ({ database, userId }: { database: Database, userId: string }) => ({
    items: database.get<Item>('items').query(Q.where('user_id', userId)).observe(),
}));

const EnhancedPantriList = enhance(PantriList);

export default function Pantri() {
    const user = useAuthStore((s) => s.user);
    const database = useDatabase();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to see your pantri.</Text>
            </View>
        );
    }

    return <EnhancedPantriList database={database} userId={user.id} />;
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 50 },
    title: { fontWeight: "bold", fontSize: 20 },
    itemsSection: { marginTop: 30, flex: 1 },
    sectionTitle: { marginTop: 10, fontWeight: "bold", fontSize: 16 },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemName: { fontWeight: "600" },
    itemDetail: { color: "#666", fontSize: 12 },
    emptyText: { color: "#999", marginTop: 10 },
});
