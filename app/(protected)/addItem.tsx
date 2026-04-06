import { Colors } from "@/src/constants/colors";
import { createItem } from "@/src/features/items/services/item.service";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddItem() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Item name is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (!expiresAt.trim()) {
                Alert.alert("Validation", "Expiry date is required.");
                setIsSubmitting(false);
                return;
            }

            const parsedDate = new Date(expiresAt.trim());
            if (isNaN(parsedDate.getTime())) {
                Alert.alert("Validation", "Invalid date format. Use YYYY-MM-DD.");
                setIsSubmitting(false);
                return;
            }

            await createItem({
                name: name.trim(),
                category: category.trim() || undefined,
                expiresAt: parsedDate,
                isConsumed: false,
            });

            router.back();
        } catch (err: any) {
            Alert.alert("Error", err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Add Item</Text>

                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Cornflakes"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                />

                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Cereal"
                    value={category}
                    onChangeText={setCategory}
                />

                <Text style={styles.label}>Expires At *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={expiresAt}
                    onChangeText={setExpiresAt}
                    keyboardType="numbers-and-punctuation"
                />

                <View style={styles.buttons}>
                    <Button
                        title={isSubmitting ? "Saving..." : "Save Item"}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        color={Colors.primary}
                    />
                    <View style={{ height: 10 }} />
                    <Button
                        title="Cancel"
                        onPress={() => router.back()}
                        color="#999"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#fff" },
    container: { padding: 24, paddingTop: 60 },
    heading: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
    label: { fontSize: 14, fontWeight: "600", marginTop: 16, marginBottom: 6, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    buttons: { marginTop: 32 },
});