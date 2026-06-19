import { AddButton } from "@/src/components/AddButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { Colors } from "@/src/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.text,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add_placeholder"
        options={{
          title: "",
          tabBarButton: AddButton,
        }}
      />
      <Tabs.Screen
        name="pantri"
        options={{
          title: "Pantri",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="receipt-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
