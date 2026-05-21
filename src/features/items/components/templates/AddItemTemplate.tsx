import { Colors } from "@/src/constants/colors";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

interface AddItemTemplateProps {
    onBack: () => void;
    children: React.ReactNode;
}

export const AddItemTemplate = ({ onBack, children }: AddItemTemplateProps) => {

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.header} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f5f5f3",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 64,
        padding: 16,
        backgroundColor: "#f5f5f3",
    },
    headerActionBtn: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: Colors.green,
        letterSpacing: -0.4,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 48,
    },
});
