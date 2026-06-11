import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MotivationalBannerProps } from "../constants";

export function MotivationalBanner({
  message = "Let's reduce waste together",
}: MotivationalBannerProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    borderWidth: 1.2,
    borderColor: "#E0DBD3",
    backgroundColor: "#FEFEFE",
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5C564E",
    letterSpacing: 0.1,
  },
});
