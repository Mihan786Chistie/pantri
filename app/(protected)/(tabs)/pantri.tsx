import { Text } from "@/src/components/Text";
import Item from "@/src/db/model/Item";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { PantriTemplate } from "@/src/features/items/components/templates/PantriTemplate";
import { autoCleanupItems } from "@/src/features/items/services/item.service";
import { FilterType } from "@/src/features/items/types";
import { groupByCategory } from "@/src/features/items/utils";
import { Database, Q } from "@nozbe/watermelondb";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface PantriListProps {
  items: Item[];
}

const PantriList = ({ items }: PantriListProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (items.length > 0) {
      autoCleanupItems(items);
    }
  }, [items]);

  const filtered = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;
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
    items: database
      .get<Item>("items")
      .query(Q.where("user_id", userId))
      .observeWithColumns(["category", "name", "is_consumed", "expires_at", "emoji"]),
  }),
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
