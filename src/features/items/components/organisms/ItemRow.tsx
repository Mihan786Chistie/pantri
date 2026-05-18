import Item from "@/src/db/model/Item";
import { deleteItem, updateItem } from "@/src/features/items/services/item.service";
import { ItemRowProps } from "@/src/features/items/types";
import getExpiryDots, { checkExpiry, findFoodEmoji } from "@/src/features/items/utils";
import { withObservables } from "@nozbe/watermelondb/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, PanResponder, StyleSheet, Text } from "react-native";
import { ConsumeCheckbox } from "../atoms/ConsumeCheckbox";
import { EmojiButton } from "../atoms/EmojiButton";
import { ItemRowInfo } from "../molecules/ItemRowInfo";

export const ItemRow = ({ item, onEditEmoji }: ItemRowProps) => {
    const [emoji, setEmoji] = useState(item.emoji || "📦");
    const pan = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        if (item.emoji) {
            setEmoji(item.emoji);
            return;
        }

        let isMounted = true;
        findFoodEmoji(item.name).then((res) => {
            if (isMounted) {
                setEmoji(res);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [item.name, item.emoji]);

    const handleConsumeItem = useCallback(async () => {
        try {
            await updateItem(item, { isConsumed: !item.isConsumed });
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    }, [item]);

    const handleDeleteItem = useCallback(async () => {
        try {
            await deleteItem(item);
        } catch (err: any) {
            Alert.alert("Error", err.message);

            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
        }
    }, [item, pan]);

    const handlePressEmoji = useCallback(() => {
        if (onEditEmoji) {
            onEditEmoji(item);
        } else {
            console.warn("[ItemRow] onEditEmoji callback is undefined!");
        }
    }, [item, onEditEmoji]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gestureState) => {
                const threshold = 140;
                if (gestureState.dx < -threshold) {

                    Animated.timing(pan, {
                        toValue: { x: -500, y: 0 },
                        duration: 150,
                        useNativeDriver: false,
                    }).start(() => handleDeleteItem());
                } else if (gestureState.dx > threshold) {

                    Animated.timing(pan, {
                        toValue: { x: 500, y: 0 },
                        duration: 150,
                        useNativeDriver: false,
                    }).start(() => handleDeleteItem());
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const dots = getExpiryDots(item);
    const daysLeft = checkExpiry(item);

    return (
        <>
            <Animated.View
                style={[
                    styles.itemRow,
                    item.isConsumed && styles.itemRowConsumed,
                    daysLeft <= 0 && styles.itemCardExpired,
                    { transform: [{ translateX: pan.x }] }
                ]}
                {...panResponder.panHandlers}
            >
                <EmojiButton
                    emoji={emoji}
                    isConsumed={item.isConsumed}
                    isExpired={daysLeft <= 0}
                    onPress={handlePressEmoji}
                />

                <ItemRowInfo
                    name={item.name}
                    isConsumed={item.isConsumed}
                    dots={dots}
                />

                {daysLeft > 0 && (
                    <ConsumeCheckbox
                        isConsumed={item.isConsumed}
                        onPress={handleConsumeItem}
                    />
                )}
                {daysLeft <= 0 && !item.isConsumed && (
                    <Text style={{ fontSize: 25 }}>💀</Text>
                )}
            </Animated.View>
        </>
    );
};

export const EnhancedItemRow = withObservables(["item"], ({ item }: { item: Item }) => ({
    item: item.observe(),
}))(ItemRow);

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: "transparent",
    },
    itemRowConsumed: {
        backgroundColor: "#fafaf9",
    },
    itemCardExpired: {
        backgroundColor: "rgba(255, 99, 71, 0.04)",
        opacity: 0.7,
    },
});
