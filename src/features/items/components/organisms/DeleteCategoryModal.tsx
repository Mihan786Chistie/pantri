import { AddButton } from "@/src/components/AddButton";
import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface DeleteCategoryModalProps {
  isVisible: boolean;
  categoryName: string;
  items: any[];
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCategoryModal = ({
  isVisible,
  categoryName,
  items,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) => {
  const previewItems = items?.slice(0, 4) || [];
  const remainingCount = (items?.length || 0) - 4;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete {categoryName}?</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color={Colors.default} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.warningText}>
              {categoryName}
              {" contains "}
              <Text style={{ fontWeight: "800", fontSize: 18 }}>
                {items.length}
              </Text>{" "}
              item
              {items.length !== 1 ? "s" : ""}.{" "}
              {items.length !== 1 ? "These" : "It"} will be moved to{" "}
              <Text style={{ fontWeight: "800", fontSize: 18 }}>Other</Text> if
              deleted.
            </Text>
            <View style={styles.gridContainer}>
              {previewItems.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>
                    {item.emoji} {item.name}
                  </Text>
                </View>
              ))}
              {remainingCount > 0 && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>+{remainingCount} more</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <AddButton
              iconName="checkmark"
              color={Colors.complimentary}
              onPress={onConfirm}
              isFloating={false}
            />
          </View>
        </Pressable>
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
    fontSize: 18,
    fontWeight: "600",
    color: Colors.complimentary,
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    padding: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: Colors.default,
  },
  content: {
    marginBottom: 20,
  },
  warningText: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: "500",
  },
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderWidth: 1.2,
    borderColor: Colors.default,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.default,
    letterSpacing: -0.2,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
