import Item from "@/src/db/model/Item";
import { EnhancedItemRow } from "@/src/features/items/components/organisms/ItemRow";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { checkExpiry, getRandomCelebrateEmoji } from "../../utils";

interface ExpiringItemsListProps {
  items: Item[];
}

export const ExpiringItemsList = ({ items }: ExpiringItemsListProps) => {
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
        {expiringItems.length === 0 ? (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyIcon}>{getRandomCelebrateEmoji()}</Text>
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
    fontWeight: "800",
    color: "#2C2C2C",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 4,
    letterSpacing: -0.5,
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    fontSize: 14,
    color: "#7A746C",
    textAlign: "center",
  },
});
