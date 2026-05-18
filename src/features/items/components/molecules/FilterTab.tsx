import { Colors } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterTabProps {
    isActive: boolean;
    label: string;
    onPress: () => void;
}

export const FilterTab = ({ isActive, label, onPress }: FilterTabProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.filterBtn, isActive && styles.filterBtnActive]}
        >
            <Text style={[styles.filterBtnText, isActive && styles.filterBtnTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    filterBtn: {
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderColor: "#ddd",
    },
    filterBtnActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterBtnText: {
        fontSize: 13,
        color: "#555",
    },
    filterBtnTextActive: {
        color: "#fff",
    },
});
