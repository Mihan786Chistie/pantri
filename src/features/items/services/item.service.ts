import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { Q } from "@nozbe/watermelondb";
import uuid from "react-native-uuid";
import { database } from "../../../db/index";
import Item from "../../../db/model/Item";
import { ItemType, ItemUpdateType } from "../types";
import { DEFAULT_CATEGORIES } from "../utils";

export async function createItem(data: ItemType) {
  await database.write(async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error("Not logged in");

    await database.get<Item>("items").create((record: Item) => {
      (record as any)._raw.id = uuid.v4() as string;
      record.name = data.name;
      if (data.category) record.category = data.category;
      if (data.emoji) (record as any).emoji = data.emoji;
      record.expiresAt = data.expiresAt;
      record.isConsumed = false;
      record.userId = userId;
    });
  });
}

export async function updateItem(item: Item, data: ItemUpdateType) {
  await database.write(async () => {
    await item.update((record: Item) => {
      if (data.isConsumed !== undefined) {
        record.isConsumed = data.isConsumed;
        (record as any).consumedAt = data.isConsumed ? new Date() : null;
      }
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

export async function autoCleanupItems(items: Item[]) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (const item of items) {
    let shouldDelete = false;

    if (item.expiresAt) {
      const daysLeft = Math.ceil(
        (item.expiresAt.getTime() - now) / (1000 * 60 * 60 * 24),
      );
      if (daysLeft < 0) {
        shouldDelete = true;
      }
    }

    const consumedAt = (item as any).consumedAt;
    if (item.isConsumed && consumedAt) {
      if (now - consumedAt.getTime() > oneDayMs) {
        shouldDelete = true;
      }
    }

    if (shouldDelete) {
      try {
        await deleteItem(item);
        console.log(
          `[AutoCleanup] Automatically deleted expired/consumed item: ${item.name}`,
        );
      } catch (e) {
        console.warn(`[AutoCleanup] Failed to delete item: ${item.name}`, e);
      }
    }
  }
}

export async function getCategories(): Promise<string[]> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return [];

  const records = await database
    .get<any>("categories")
    .query(Q.where("user_id", userId))
    .fetch();

  if (records.length === 0) {
    const defaults = DEFAULT_CATEGORIES;
    await database.write(async () => {
      for (const name of defaults) {
        await database.get<any>("categories").create((record: any) => {
          record._raw.id = uuid.v4() as string;
          record.name = name;
          record.userId = userId;
        });
      }
    });
    return defaults;
  }

  return records.map((r: any) => r.name);
}

export async function createCategory(name: string): Promise<string> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("Not logged in");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name cannot be empty");

  const existing = await database
    .get<any>("categories")
    .query(Q.where("name", Q.like(trimmed)))
    .fetch();

  if (existing.length > 0) {
    return existing[0].name;
  }

  await database.write(async () => {
    await database.get<any>("categories").create((record: any) => {
      record._raw.id = uuid.v4() as string;
      record.name = trimmed;
      record.userId = userId;
    });
  });

  return trimmed;
}

export async function updateCategory(
  oldName: string,
  newName: string,
): Promise<void> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("Not logged in");

  const trimmedOld = oldName.trim();
  const trimmedNew = newName.trim();
  if (!trimmedNew) throw new Error("Category name cannot be empty");

  await database.write(async () => {
    const catRecords = await database
      .get<any>("categories")
      .query(Q.where("name", trimmedOld), Q.where("user_id", userId))
      .fetch();

    for (const record of catRecords) {
      await record.update((r: any) => {
        r.name = trimmedNew;
      });
    }

    const itemRecords = await database
      .get<any>("items")
      .query(Q.where("category", trimmedOld), Q.where("user_id", userId))
      .fetch();

    for (const record of itemRecords) {
      await record.update((r: any) => {
        r.category = trimmedNew;
      });
    }
  });
}

export async function deleteCategory(name: string): Promise<void> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("Not logged in");

  const trimmed = name.trim();

  await database.write(async () => {
    const catRecords = await database
      .get<any>("categories")
      .query(Q.where("name", trimmed), Q.where("user_id", userId))
      .fetch();

    for (const record of catRecords) {
      await record.markAsDeleted();
    }

    const itemRecords = await database
      .get<any>("items")
      .query(Q.where("category", trimmed), Q.where("user_id", userId))
      .fetch();

    for (const record of itemRecords) {
      await record.update((r: any) => {
        r.category = "Other";
      });
    }
  });
}
