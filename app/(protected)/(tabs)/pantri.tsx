import Item from "@/src/db/model/Item";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { PantriTemplate } from "@/src/features/items/components/templates/PantriTemplate";
import { deleteItem } from "@/src/features/items/services/item.service";
import { FilterType } from "@/src/features/items/types";
import { checkExpiry, groupByCategory } from "@/src/features/items/utils";
import { Database, Q } from "@nozbe/watermelondb";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface PantriListProps {
    items: Item[];
}

const PantriList = ({ items }: PantriListProps) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    useEffect(() => {
        const runCleanup = async () => {
            const oneDayMs = 24 * 60 * 60 * 1000;
            const now = Date.now();

            for (const item of items) {
                let shouldDelete = false;

                if (item.expiresAt) {
                    const daysLeft = Math.ceil(
                        (item.expiresAt.getTime() - now) / (1000 * 60 * 60 * 24)
                    );
                    if (daysLeft < 0) {
                        shouldDelete = true;
                    }
                }

                const consumedAt = (item as any).consumedAt;
                if (item.isConsumed && consumedAt) {
                    if (now - consumedAt.getTime() > oneDayMs) {
                        shouldDelete = true;
                    }
                }

                if (shouldDelete) {
                    try {
                        await deleteItem(item);
                        console.log(`[AutoCleanup] Automatically deleted expired/consumed item: ${item.name}`);
                    } catch (e) {
                        console.warn(`[AutoCleanup] Failed to delete item: ${item.name}`, e);
                    }
                }
            }
        };

        if (items.length > 0) {
            runCleanup();
        }
    }, [items]);

    const filtered = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        if (filter === "expiring") {
            const daysLeft = checkExpiry(item);
            return daysLeft >= 0 && daysLeft <= 3 && !item.isConsumed;
        }

        return true;
    });

    const sections = groupByCategory(filtered);

    return (
        <PantriTemplate
            searchQuery={search}
            onSearchQueryChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            sections={sections}
            totalItems={items.length}
        />
    );
};

const enhance = withObservables(
    ["userId"],
    ({ database, userId }: { database: Database; userId: string }) => ({
        items: database.get<Item>("items").query(Q.where("user_id", userId)).observe(),
    })
);

const EnhancedPantriList = enhance(PantriList);

export default function Pantri() {
    const user = useAuthStore((s) => s.user);
    const database = useDatabase();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Please log in to see your pantri.</Text>
            </View>
        );
    }

    return <EnhancedPantriList database={database} userId={user.id} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f3",
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#999",
        fontSize: 14,
    },
});