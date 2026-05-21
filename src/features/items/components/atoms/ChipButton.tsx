import { Colors } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import * as Haptics from "expo-haptics";

interface ChipButtonProps extends TouchableOpacityProps {
    label: string;
    isSelected: boolean;
}

export const ChipButton = ({ label, isSelected, onPress, style, ...props }: ChipButtonProps) => {
    const handlePress = (e: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
                style,
            ]}
            onPress={handlePress}
            {...props}
        >
            <Text
                style={[
                    styles.label,
                    isSelected ? styles.labelSelected : styles.labelUnselected,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    chipUnselected: {
        backgroundColor: "#fafaf9",
        borderColor: "#f0f0ee",
    },
    chipSelected: {
        backgroundColor: "rgba(15, 118, 30, 0.08)",
        borderColor: "rgba(15, 118, 30, 0.2)",
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
    },
    labelUnselected: {
        color: "#555452",
    },
    labelSelected: {
        color: Colors.primary,
        fontWeight: "700",
    },
});
