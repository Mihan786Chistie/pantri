import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MotivationalBannerProps } from "../constants";

export function MotivationalBanner({
  message = "Let's reduce waste together 💚",
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
    borderColor: Colors.default,
    backgroundColor: Colors.background,
    marginVertical: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.green,
    letterSpacing: 0.1,
  },
});
