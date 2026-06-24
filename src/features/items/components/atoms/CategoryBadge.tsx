import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CategoryBadgeProps {
  count: number;
}

export const CategoryBadge = ({ count }: CategoryBadgeProps) => {
  return (
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryBadgeText}>
        {count} {count === 1 ? "item" : "items"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBadge: {
    backgroundColor: "rgba(15, 118, 30, 0.07)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "rgba(15, 118, 30, 0.14)",
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.primary,
  },
});
