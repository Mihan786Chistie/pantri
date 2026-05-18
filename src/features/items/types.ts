import Item from "@/src/db/model/Item";

export type ItemType = {
    name: string;
    category?: string;
    expiresAt: Date;
    isConsumed: boolean;
    consumedAt?: Date;
}

export type ItemUpdateType = {
    name?: string;
    category?: string;
    expiresAt?: Date;
    isConsumed?: boolean;
    emoji?: string;
    consumedAt?: Date;
}

export type FilterType = "all" | "expiring";

export interface ItemRowProps {
    item: Item;
}

export interface Section {
    title: string;
    data: Item[];
}