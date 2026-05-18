import { POPULAR_FOOD_EMOJIS } from "@/src/features/items/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmojiPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectEmoji: (emoji: string) => void;
}

export const EmojiPickerModal = ({ isVisible, onClose, onSelectEmoji }: EmojiPickerModalProps) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Choose an Emoji</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={POPULAR_FOOD_EMOJIS}
                        keyExtractor={(item) => item}
                        numColumns={5}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.emojiGrid}
                        renderItem={({ item: em }) => (
                            <TouchableOpacity
                                onPress={() => onSelectEmoji(em)}
                                style={styles.emojiGridItem}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.emojiGridText}>{em}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
        maxHeight: "65%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f0f0ee",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1a1a1a",
        letterSpacing: -0.4,
    },
    modalCloseBtn: {
        padding: 4,
    },
    emojiGrid: {
        paddingBottom: 20,
    },
    emojiGridItem: {
        flex: 1,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 6,
        backgroundColor: "#f5f5f3",
        borderRadius: 12,
        height: 52,
    },
    emojiGridText: {
        fontSize: 28,
    },
});
