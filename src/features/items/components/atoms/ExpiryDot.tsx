import React from "react";
import { StyleSheet, View } from "react-native";

interface ExpiryDotProps {
    color: string;
}

export const ExpiryDot = ({ color }: ExpiryDotProps) => {
    return <View style={[styles.dot, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
    dot: {
        width: 18,
        height: 4,
        borderRadius: 2,
    },
});
