import { AddButton } from "@/src/components/AddButton";
import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  createCategory,
  createItem,
  deleteCategory,
  getCategories,
} from "../../services/item.service";
import { findFoodEmoji } from "../../utils";
import { CategoryTagRow } from "../molecules/CategoryTagRow";
import { DatePickerSection } from "../molecules/DatePickerSection";
import { CustomCategoryModal } from "./CustomCategoryModal";

interface AddItemFormProps {
  onSuccess: () => void;
}

export const AddItemForm = ({ onSuccess }: AddItemFormProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [expiresAt, setExpiresAt] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 7);
    return d;
  });

  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const list = await getCategories();
      setCategoriesList(list);
    } catch (e) {
      console.error("Error loading categories", e);
    }
  };

  useEffect(() => {
    if (!name.trim()) {
      setEmoji("📦");
      return;
    }

    let isCurrent = true;
    const delayDebounce = setTimeout(() => {
      findFoodEmoji(name.trim()).then((foundEmoji) => {
        if (isCurrent) {
          setEmoji(foundEmoji);
        }
      });
    }, 300);

    return () => {
      isCurrent = false;
      clearTimeout(delayDebounce);
    };
  }, [name]);

  const handleDeleteCategory = async (catName: string) => {
    try {
      await deleteCategory(catName);
      if (category === catName) {
        setCategory("Other");
      }
      await loadCategories();
    } catch (e) {
      console.error("Error deleting category", e);
    }
  };

  const handleAddCustomCategory = async (newCat: string) => {
    try {
      const saved = await createCategory(newCat);
      await loadCategories();
      setCategory(saved);
      setErrors((prev) => ({ ...prev, category: "", submit: "" }));
    } catch (e: any) {
      setErrors((prev) => ({
        ...prev,
        category: e.message || "Failed to create category",
      }));
    }
  };

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Item name is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createItem({
        name: name.trim(),
        category: category.trim() || undefined,
        expiresAt,
        isConsumed: false,
        emoji,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      onSuccess();
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "An error occurred while saving the item.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroInputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="What are you adding?"
            placeholderTextColor={Colors.default}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: "" }));
              }
            }}
            multiline
            style={styles.nameInput}
            autoFocus
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.categoryLabel}>CATEGORY</Text>
        </View>
        <CategoryTagRow
          selected={category}
          onSelect={setCategory}
          categories={categoriesList}
          onAddCustom={() => setIsCategoryModalVisible(true)}
          onDelete={handleDeleteCategory}
        />
        {errors.category && (
          <Text style={[styles.errorText, { marginTop: 8 }]}>
            {errors.category}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>EXPIRES ON</Text>
        <DatePickerSection value={expiresAt} onChange={setExpiresAt} />
      </View>

      {errors.submit && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color="#ef4444"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{errors.submit}</Text>
        </View>
      )}

      <View style={styles.footerContainer}>
        <AddButton
          iconName="checkmark"
          onPress={handleSubmit}
          isFloating={false}
          disabled={isSubmitting}
        />
      </View>

      <CustomCategoryModal
        isVisible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onSubmit={handleAddCustomCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 16,
  },
  heroInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 40,
  },
  sparklesIcon: {
    marginRight: 10,
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
  },
  nameInput: {
    fontSize: 35,
    fontFamily: "Poppins_500Medium",
    color: Colors.green,
    padding: 0,
    margin: 0,
    letterSpacing: -0.6,
    textAlignVertical: "top",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf2f2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  errorIcon: {
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ef4444",
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 28,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.background,
    letterSpacing: -0.2,
  },
  checkIcon: {
    marginLeft: 6,
    marginTop: 1,
  },
});
