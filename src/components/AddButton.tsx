import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CustomPlusIcon = ({
  color = "#fff",
  size = 32,
}: {
  color?: string;
  size?: number;
}) => {
  const pillWidth = 8;
  const pillLength = 14;
  const offset = 3;

  const pillStyle: ViewStyle = {
    position: "absolute",
    backgroundColor: color,
    borderRadius: pillWidth / 2,
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={[
          pillStyle,
          {
            top: size / 2 - offset - pillLength,
            width: pillWidth,
            height: pillLength,
          },
        ]}
      />
      <View
        style={[
          pillStyle,
          {
            bottom: size / 2 - offset - pillLength,
            width: pillWidth,
            height: pillLength,
          },
        ]}
      />
      <View
        style={[
          pillStyle,
          {
            left: size / 2 - offset - pillLength,
            width: pillLength,
            height: pillWidth,
          },
        ]}
      />
      <View
        style={[
          pillStyle,
          {
            right: size / 2 - offset - pillLength,
            width: pillLength,
            height: pillWidth,
          },
        ]}
      />
    </View>
  );
};

interface AddButtonProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: (e?: any) => void;
  style?: StyleProp<ViewStyle>;
  isFloating?: boolean;
  disabled?: boolean | null;
  [key: string]: any;
}

export const AddButton = ({
  iconName = "add-outline",
  onPress,
  color = Colors.primary,
  style,
  isFloating = true,
  disabled = false,
  ...rest
}: AddButtonProps) => {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.6 : 1,
    };
  });

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1);
  };

  const handlePress = (e?: any) => {
    if (disabled) return;
    if (!isFloating && onPress) {
      onPress(e);
    } else {
      router.push("/addItem");
    }
  };

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[isFloating ? styles.container : styles.inlineContainer, style]}
      disabled={disabled}
    >
      <Animated.View
        style={[styles.button, animatedStyle, { backgroundColor: color }]}
      >
        {iconName === "add-outline" ? (
          <CustomPlusIcon color="#fff" size={32} />
        ) : (
          <Ionicons name={iconName} size={40} color="#fff" />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -28 }],
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineContainer: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 20,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
