import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ConsumeCheckboxProps {
    isConsumed: boolean;
    onPress: () => void;
}

export const ConsumeCheckbox = ({ isConsumed, onPress }: ConsumeCheckboxProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.checkBtn, isConsumed && styles.checkBtnChecked]}
            accessibilityLabel={isConsumed ? "Mark as unconsumed" : "Mark as consumed"}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isConsumed }}
        >
            {isConsumed && <Ionicons name={"checkmark-sharp"} size={24} color={"#ffffff"} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkBtn: {
        width: 32,
        height: 32,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: 1,
    },
    checkBtnChecked: {
        backgroundColor: Colors.primary,
        opacity: 1,
    },
});
