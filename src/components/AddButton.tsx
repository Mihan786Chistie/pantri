import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

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
            <Animated.View style={[styles.button, animatedStyle]}>
                <Ionicons name={iconName} size={32} color="#fff" />
            </Animated.View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -28 }, { translateY: -28 }],
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inlineContainer: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    }
});