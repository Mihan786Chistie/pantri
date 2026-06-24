import { Colors } from "@/src/constants/colors";
import React from "react";
import { Text } from "@/src/components/Text";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EmojiSelectRowProps {
    emoji: string;
    onPress: () => void;
}

export const EmojiSelectRow = ({ emoji, onPress }: EmojiSelectRowProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={onPress}
                style={styles.emojiCard}
            >
                <Text style={styles.emojiText}>{emoji}</Text>
                <View style={styles.editBadge}>
                    <Ionicons name="pencil" size={10} color="#fff" style={styles.pencilIcon} />
                </View>
            </TouchableOpacity>

            <View style={styles.infoCol}>
                <Text style={styles.title}>Item Icon</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                    <Text style={styles.linkText}>Tap to change</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: "#f0f0ee",
        borderRadius: 16,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    emojiCard: {
        width: 58,
        height: 58,
        borderRadius: 14,
        backgroundColor: "#fafaf9",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderWidth: 1,
        borderColor: "#f0f0ee",
    },
    emojiText: {
        fontSize: 32,
    },
    editBadge: {
        position: "absolute",
        bottom: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#ffffff",
    },
    pencilIcon: {
        marginTop: 0.5,
    },
    infoCol: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 2,
    },
    linkText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.primary,
    },
});
