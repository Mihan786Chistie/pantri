import { Colors } from "@/src/constants/colors";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

interface FormButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "danger" | "cancel";
    isLoading?: boolean;
}

export const FormButton = ({
    title,
    variant = "primary",
    isLoading = false,
    style,
    onPress,
    disabled,
    ...props
}: FormButtonProps) => {
    const handlePress = (e: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        onPress?.(e);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={[
                styles.button,
                styles[variant],
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
            onPress={handlePress}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === "cancel" || variant === "secondary" ? Colors.primary : "#ffffff"}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        styles[`text_${variant}`],
                        disabled && styles.textDisabled,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    danger: {
        backgroundColor: Colors.red,
    },
    cancel: {
        backgroundColor: "#f5f5f3",
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: -0.2,
    },
    text_primary: {
        color: "#ffffff",
    },
    text_secondary: {
        color: Colors.primary,
    },
    text_danger: {
        color: Colors.background,
    },
    text_cancel: {
        color: Colors.default,
    },
    textDisabled: {
        color: "#a1a19f",
    },
});
