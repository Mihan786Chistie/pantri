import { Text } from "@/src/components/Text";
import React from "react";
import { StyleSheet, View } from "react-native";
import { CategoryBadge } from "../atoms/CategoryBadge";

interface CategoryHeaderProps {
  title: string;
  count: number;
}

export const CategoryHeader = ({ title, count }: CategoryHeaderProps) => {
  return (
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <CategoryBadge count={count} />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    textTransform: "capitalize",
    letterSpacing: -0.4,
  },
});
