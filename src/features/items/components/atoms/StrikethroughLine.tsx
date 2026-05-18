import React from "react";
import { StyleSheet, View } from "react-native";

export const StrikethroughLine = () => {
    return <View style={styles.strikethrough} />;
};

const styles = StyleSheet.create({
    strikethrough: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "52%",
        height: 2.2,
        backgroundColor: "#0f0f0fff",
    },
});
