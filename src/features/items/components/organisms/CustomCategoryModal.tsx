import { AddButton } from "@/src/components/AddButton";
import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FormInput } from "../atoms/FormInput";
import { FormField } from "../molecules/FormField";

interface CustomCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (category: string) => void;
}

export const CustomCategoryModal = ({
  isVisible,
  onClose,
  onSubmit,
}: CustomCategoryModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
      return;
    }

    setError("");
    onSubmit(name.trim());
    setName("");
    onClose();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
  };

  const handleClose = () => {
    setError("");
    setName("");
    onClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={Colors.default} />
              </TouchableOpacity>
            </View>

            <FormField
              label="Category Name"
              isRequired
              error={error}
              style={styles.field}
            >
              <FormInput
                placeholder="e.g. Snacks, Frozen, etc."
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) setError("");
                }}
                autoFocus
              />
            </FormField>

            <View style={styles.buttonGroup}>
              <AddButton
                iconName="checkmark"
                onPress={handleSave}
                isFloating={false}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    width: "88%",
    maxWidth: 340,
    borderWidth: 1.2,
    borderColor: Colors.default,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0ee",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#1a1a1a",
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    padding: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: Colors.default,
  },
  field: {
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
