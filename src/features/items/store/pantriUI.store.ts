import Item from "@/src/db/model/Item";
import { updateItem } from "@/src/features/items/services/item.service";
import { Alert } from "react-native";
import { create } from "zustand";

interface PantriUIState {
    selectedItem: Item | null;
    isPickerVisible: boolean;
    openPicker: (item: Item) => void;
    closePicker: () => void;
    selectEmoji: (emoji: string) => Promise<void>;
}

export const usePantriUIStore = create<PantriUIState>((set, get) => ({
    selectedItem: null,
    isPickerVisible: false,
    openPicker: (item: Item) => {
        set({ selectedItem: item, isPickerVisible: true });
    },
    closePicker: () => {
        set({ selectedItem: null, isPickerVisible: false });
    },
    selectEmoji: async (emoji: string) => {
        const { selectedItem } = get();
        if (!selectedItem) return;

        try {
            await updateItem(selectedItem, { emoji });
            set({ selectedItem: null, isPickerVisible: false });
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    },
}));
