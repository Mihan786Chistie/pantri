import Item from "@/src/db/model/Item";

export type ItemType = {
    name: string;
    category?: string;
    expiresAt: Date;
    isConsumed: boolean;
}

export type ItemUpdateType = {
    name?: string;
    category?: string;
    expiresAt?: Date;
    isConsumed?: boolean;
    emoji?: string;
}

export type FilterType = "all" | "expiring";

export interface ItemRowProps {
    item: Item;
    onEditEmoji?: (item: Item) => void;
}

export interface Section {
    title: string;
    data: Item[];
}