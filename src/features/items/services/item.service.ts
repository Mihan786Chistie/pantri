import { useAuthStore } from '@/src/features/auth/store/auth.store';
import uuid from 'react-native-uuid';
import { database } from '../../../db/index';
import Item from '../../../db/model/Item';
import { ItemType, ItemUpdateType } from '../types';

export async function createItem(data: ItemType) {
    await database.write(async () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) throw new Error("Not logged in");

        await database.get<Item>('items').create((record: Item) => {
            (record as any)._raw.id = uuid.v4() as string;
            record.name = data.name;
            if (data.category) record.category = data.category;
            record.expiresAt = data.expiresAt;
            record.isConsumed = false;
            record.userId = userId;
        });
    });
}

export async function updateItem(item: Item, data: ItemUpdateType) {
    await database.write(async () => {
        await item.update((record: Item) => {
            if (data.isConsumed !== undefined) record.isConsumed = data.isConsumed;
            if (data.name !== undefined) record.name = data.name;
            if (data.category !== undefined) record.category = data.category;
            if (data.expiresAt !== undefined) record.expiresAt = data.expiresAt;
            if (data.emoji !== undefined) (record as any).emoji = data.emoji;
        });
    });
}

export async function deleteItem(item: Item) {
    await database.write(async () => {
        await item.markAsDeleted();
    });
}
