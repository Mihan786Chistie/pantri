import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExpiryDot } from "../atoms/ExpiryDot";
import { StrikethroughLine } from "../atoms/StrikethroughLine";

interface ItemRowInfoProps {
    name: string;
    isConsumed: boolean;
    dots: string[];
}

export const ItemRowInfo = ({ name, isConsumed, dots }: ItemRowInfoProps) => {
    return (
        <View style={styles.itemInfo}>
            <View style={styles.itemNameWrapper}>
                <Text style={styles.itemName}>{name}</Text>
                {isConsumed && <StrikethroughLine />}
            </View>

            <View style={styles.dotsRow}>
                {dots.map((color, i) => (
                    <ExpiryDot key={i} color={color} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemInfo: {
        flex: 1,
        minWidth: 0,
    },
    itemNameWrapper: {
        position: "relative",
        flexDirection: "row",
        alignSelf: "flex-start",
    },
    itemName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    dotsRow: {
        flexDirection: "row",
        gap: 3,
        marginTop: 5,
    },
});
