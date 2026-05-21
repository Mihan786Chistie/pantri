import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FormButton } from "../atoms/FormButton";
import { FormInput } from "../atoms/FormInput";
import { FormField } from "../molecules/FormField";
import * as Haptics from "expo-haptics";

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
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
            return;
        }

        setError("");
        onSubmit(name.trim());
        setName("");
        onClose();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
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
                            <Text style={styles.modalTitle}>New Category</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={20} color="#687076" />
                            </TouchableOpacity>
                        </View>

                        <FormField label="Category Name" isRequired error={error} style={styles.field}>
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
                            <FormButton
                                title="Add Category"
                                variant="primary"
                                onPress={handleSave}
                            />
                            <FormButton
                                title="Cancel"
                                variant="cancel"
                                onPress={handleClose}
                                style={styles.cancelBtn}
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
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
        width: "88%",
        maxWidth: 340,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
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
        fontWeight: "800",
        color: "#1a1a1a",
        letterSpacing: -0.4,
    },
    modalCloseBtn: {
        padding: 4,
    },
    field: {
        marginBottom: 20,
    },
    buttonGroup: {
        gap: 8,
    },
    cancelBtn: {
        marginTop: 2,
    },
});
