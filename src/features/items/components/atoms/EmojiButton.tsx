import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface EmojiButtonProps {
    emoji: string;
    isConsumed: boolean;
    isExpired: boolean;
    onPress: () => void;
}

export const EmojiButton = ({ emoji, isConsumed, isExpired, onPress }: EmojiButtonProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={isConsumed || isExpired}
            style={[styles.itemEmojiContainer, isConsumed && styles.itemContentConsumed]}
        >
            <Text style={styles.itemEmojiText}>{emoji}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemEmojiContainer: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: "#f5f5f3",
        alignItems: "center",
        justifyContent: "center",
    },
    itemEmojiText: {
        fontSize: 25,
    },
    itemContentConsumed: {
        opacity: 0.55,
    },
});
