import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Search items..." }: SearchBarProps) => {
    return (
        <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#aaa" />
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
                clearButtonMode="while-editing"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#ffffffff",
        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#1a1a1a",
    },
});
