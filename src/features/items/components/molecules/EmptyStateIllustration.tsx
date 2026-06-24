import { Text } from "@/src/components/Text";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export const EmptyStateIllustration = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Your pantri starts here</Text>

        <Text style={styles.subtitle}>Tap the + to add your first item</Text>
      </View>

      <View>
        <Image
          source={require("@/assets/images/arrow2.svg")}
          style={styles.image}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 28,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -100,
  },

  title: {
    fontSize: 34,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: -2,
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 30,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    letterSpacing: -2,
  },

  image: {
    width: 220,
    height: 360,
    marginRight: 10,
  },
});
