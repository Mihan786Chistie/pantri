import { Text } from "@/src/components/Text";
import React from "react";
import { StyleSheet, TextProps } from "react-native";

interface FormLabelProps extends TextProps {
  children: React.ReactNode;
}

export const FormLabel = ({ children, style, ...props }: FormLabelProps) => {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
});
