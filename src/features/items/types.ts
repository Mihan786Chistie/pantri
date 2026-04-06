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
}
