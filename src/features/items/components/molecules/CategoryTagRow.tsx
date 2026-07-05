import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CategoryTagRowProps {
  selected: string;
  onSelect: (category: string) => void;
  categories: string[];
  onAddCustom: () => void;
  onDelete?: (category: string) => void;
}

export const CategoryTagRow = ({
  selected,
  onSelect,
  categories,
  onAddCustom,
  onDelete,
}: CategoryTagRowProps) => {
  const allCategories = Array.from(new Set(categories));

  const handlePress = (catName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSelect(catName);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onAddCustom();
  };

  return (
    <View style={styles.gridContainer}>
      {allCategories.map((cat) => {
        const isSelected = selected.toLowerCase() === cat.toLowerCase();

        return (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.7}
            onPress={() => handlePress(cat)}
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isSelected
                  ? styles.chipTextSelected
                  : styles.chipTextUnselected,
              ]}
            >
              {cat}
            </Text>
            {isSelected && onDelete && cat !== "Other" && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
                    () => {},
                  );
                  onDelete(cat);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteIcon}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.background}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleAddPress}
        style={[styles.chip, styles.chipCustom]}
      >
        <Ionicons
          name="add"
          size={16}
          color={Colors.default}
          style={styles.icon}
        />
        <Text style={[styles.chipText, styles.chipTextCustom]}>Custom</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1.2,
  },
  chipSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  chipUnselected: {
    backgroundColor: Colors.background,
    borderColor: Colors.default,
  },
  chipCustom: {
    backgroundColor: Colors.background,
    borderColor: Colors.default,
    borderStyle: "dashed",
  },
  icon: {
    marginRight: 4,
  },
  deleteIcon: {
    marginLeft: 6,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  chipTextSelected: {
    color: Colors.background,
  },
  chipTextUnselected: {
    color: Colors.default,
  },
  chipTextCustom: {
    color: Colors.default,
  },
});
