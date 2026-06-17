import { Section } from "@/src/features/items/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { CategoryHeader } from "../molecules/CategoryHeader";
import { EnhancedItemRow } from "./ItemRow";

interface CategoryCardProps {
    section: Section;
}

export const CategoryCard = ({ section }: CategoryCardProps) => {
    return (
        <View style={styles.categoryCard}>
            <CategoryHeader title={section.title} count={section.data.length} />

            <View style={styles.categoryItemsList}>
                {section.data.map((item, index) => (
                    <React.Fragment key={item.id}>
                        {index > 0 && <View style={styles.rowDivider} />}
                        <EnhancedItemRow item={item} />
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 4,
        marginVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#f0f0ee",
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        overflow: "hidden",
    },
    categoryItemsList: {
        flexDirection: "column",
    },
    rowDivider: {
        height: 0.5,
        backgroundColor: "#e5e5e0",
        marginHorizontal: 14,
    },
});
