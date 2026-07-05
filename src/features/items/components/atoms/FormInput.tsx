import { Colors } from "@/src/constants/colors";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const FormInput = React.forwardRef<TextInput, TextInputProps>(
  ({ style, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <TextInput
        ref={ref}
        style={[styles.input, isFocused && styles.inputFocused, style]}
        placeholderTextColor="#a1a19f"
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  },
);

FormInput.displayName = "FormInput";

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#f1f1ef",
    borderWidth: 1.5,
    borderColor: "transparent",
    fontFamily: "Poppins_500Medium",
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: "#ffffff",
  },
});
