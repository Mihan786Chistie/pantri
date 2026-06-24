import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Item from "@/src/db/model/Item";
import { EnhancedItemRow } from "@/src/features/items/components/organisms/ItemRow";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { checkExpiry, getRandomEmoji } from "../../utils";

interface ExpiringItemsListProps {
  items: Item[];
  weeklyTrends?: any;
}

export const ExpiringItemsList = ({
  items,
  weeklyTrends,
}: ExpiringItemsListProps) => {
  const expiringItems = useMemo(() => {
    return items
      .filter(
        (item) => !item.isConsumed && item.expiresAt && checkExpiry(item) <= 7,
      )
      .sort((a, b) => {
        const dateA = a.expiresAt ? a.expiresAt.getTime() : Infinity;
        const dateB = b.expiresAt ? b.expiresAt.getTime() : Infinity;
        return dateA - dateB;
      });
  }, [items]);

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.title}>Expiring Soon</Text>
        {weeklyTrends.length > 0 && items.length === 0 ? (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyIcon}>
              {getRandomEmoji(["🥕", "🌱", "🥬", "🍎", "🛒"])}
            </Text>
            <Text style={styles.emptyText}>Nothing on the shelves</Text>
            <Text style={styles.emptySubtext}>Time to stock up again.</Text>
          </View>
        ) : expiringItems.length === 0 ? (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyIcon}>
              {getRandomEmoji(["🚀", "🎉", "🥳", "✨"])}
            </Text>
            <Text style={styles.emptyText}>All good!</Text>
            <Text style={styles.emptySubtext}>
              No items are close to expiring.
            </Text>
          </View>
        ) : (
          expiringItems.map((item) => (
            <EnhancedItemRow key={item.id} item={item} />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C2C2C",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 4,
    letterSpacing: -0.5,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: Colors.default,
  },
  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 16,
    fontWeight: "500",
    color: "#7A746C",
    textAlign: "center",
  },
});
