import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { FormLabel } from "../atoms/FormLabel";

interface FormFieldProps extends ViewProps {
    label: string;
    isRequired?: boolean;
    error?: string;
    children: React.ReactNode;
}

export const FormField = ({ label, isRequired, error, children, style, ...props }: FormFieldProps) => {
    return (
        <View style={[styles.field, style]} {...props}>
            <FormLabel>
                {label}
                {isRequired && <Text style={styles.asterisk}> *</Text>}
            </FormLabel>
            {children}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        marginBottom: 20,
        alignSelf: "stretch",
    },
    asterisk: {
        color: "#E24B4A",
    },
    errorText: {
        fontSize: 12,
        color: "#E24B4A",
        marginTop: 6,
        fontWeight: "600",
    },
});
