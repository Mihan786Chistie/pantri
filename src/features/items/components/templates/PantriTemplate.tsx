import { Colors } from "@/src/constants/colors";
import Item from "@/src/db/model/Item";
import { FilterType, Section } from "@/src/features/items/types";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FilterTab } from "../molecules/FilterTab";
import { SearchBar } from "../molecules/SearchBar";
import { CategoryCard } from "../organisms/CategoryCard";
import { EmojiPickerModal } from "../organisms/EmojiPickerModal";

interface PantriTemplateProps {
    searchQuery: string;
    onSearchQueryChange: (text: string) => void;
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    sections: Section[];
    totalItems: number;
    isPickerVisible: boolean;
    onClosePicker: () => void;
    onSelectEmoji: (emoji: string) => void;
    onEditEmoji: (item: Item) => void;
}

export const PantriTemplate = ({
    searchQuery,
    onSearchQueryChange,
    filter,
    onFilterChange,
    sections,
    totalItems,
    isPickerVisible,
    onClosePicker,
    onSelectEmoji,
    onEditEmoji,
}: PantriTemplateProps) => {
    const filters: FilterType[] = ["all", "expiring"];
    const filterLabels: Record<FilterType, string> = {
        all: "All items",
        expiring: "Expiring soon",
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Your Pantri</Text>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{totalItems} items</Text>
                    </View>
                </View>
            </View>

            <SearchBar value={searchQuery} onChangeText={onSearchQueryChange} />

            {/* Filters */}
            <View style={styles.filterRow}>
                {filters.map((f) => (
                    <FilterTab
                        key={f}
                        isActive={filter === f}
                        label={filterLabels[f]}
                        onPress={() => onFilterChange(f)}
                    />
                ))}
            </View>

            {/* Scrollable Category List */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 48 }}
                showsVerticalScrollIndicator={false}
            >
                {sections.map((section) => (
                    <CategoryCard
                        key={section.title}
                        section={section}
                        onEditEmoji={onEditEmoji}
                    />
                ))}
                {sections.length === 0 && (
                    <Text style={styles.emptyText}>No items found.</Text>
                )}
            </ScrollView>

            {/* Slide-Up Emoji Picker Modal */}
            <EmojiPickerModal
                isVisible={isPickerVisible}
                onClose={onClosePicker}
                onSelectEmoji={onSelectEmoji}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f3",
        padding: 16,
        paddingTop: 100,
    },
    header: {
        marginHorizontal: 10,
        marginBottom: 14,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 27,
        fontWeight: "800",
        color: "#1a1a1a",
        letterSpacing: -0.6,
    },
    badgeContainer: {
        backgroundColor: "rgba(15, 118, 30, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(15, 118, 30, 0.14)",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: Colors.primary,
    },
    filterRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    emptyText: {
        color: "#999",
        marginTop: 20,
        textAlign: "center",
        fontSize: 14,
    },
});
