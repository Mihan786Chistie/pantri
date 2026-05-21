import { Colors } from "@/src/constants/colors";
import Item from "@/src/db/model/Item";
import { Section } from "@/src/features/items/types";
import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";

init({ data });

export const POPULAR_FOOD_EMOJIS = [
    "🍎", "🍏", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🥝", "🥥",
    "🍈", "🍍", "🥭", "🍐", "🍑", "🫒", "🍆", "🫑", "🍄", "🥒",
    "🫚", "🫛", "🥜", "🫘", "🍊", "🍋", "🥑", "🥦", "🥬", "🥫",
    "🥕", "🍅", "🥔", "🧅", "🧄", "🌶️", "🌽", "🥚", "🧀", "🥛",
    "🧈", "🥩", "🍗", "🍖", "🥓", "🐟", "🍤", "🍞", "🥐", "🥯",
    "🥞", "🧇", "🍕", "🍔", "🌮", "🥘", "🍲", "🍚", "🌾", "🍜",
    "🍝", "🍰", "🍩", "🍪", "🍫", "🍯", "🧂", "🫙", "🧃", "☕",
    "🍵", "🍺", "🍷", "💊", "📦"
];

export const DEFAULT_CATEGORIES = [
    "Dairy",
    "Fruits",
    "Vegetables",
    "Grains",
    "Proteins",
    "Snacks",
    "Drinks",
    "Condiments",
    "Oils",
    "Other",
];

const emojiData = data as any;
const foodsCategory = emojiData.categories.find((c: any) => c.id === "foods");
const foodEmojiIds = new Set(foodsCategory ? foodsCategory.emojis : []);

const natureCategory = emojiData.categories.find((c: any) => c.id === "nature");
const natureEmojiIds = new Set(natureCategory ? natureCategory.emojis : []);

export const EMOJI_OVERRIDES: Record<string, string> = {
    chicken: "🍗",
    steak: "🥩",
    beef: "🥩",
    meat: "🥩",
    salmon: "🐟",
    fish: "🐟",
    tuna: "🐟",
    seafood: "🐟",
    shrimp: "🍤",
    yogurt: "🥛",
    cream: "🥛",
    curd: "🥛",
    butter: "🧈",
    cheese: "🧀",
    egg: "🥚",
    eggs: "🥚",
    milk: "🥛",
    bread: "🍞",
    garlic: "🧄",
    onion: "🧅",
    potato: "🥔",
    potatoes: "🥔",
    carrot: "🥕",
    tomato: "🍅",
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    lemon: "🍋",
    lime: "🍋",
    grape: "🍇",
    strawberry: "🍓",
    rice: "🍚",
    pasta: "🍝",
    noodle: "🍝",
    salt: "🧂",
    pepper: "🧂",
    oil: "🫙",
    juice: "🧃",
    coffee: "☕",
    tea: "🍵",
    beer: "🍺",
    wine: "🍷",
    pizza: "🍕",
    burger: "🍔",
    soup: "🍲",
    pill: "💊",
    capsule: "💊",
    tablet: "💊",
    drops: "💊",
    syrup: "💊",
};

export function checkExpiry(item: Item): number {
    if (!item.expiresAt) return 9999;
    const daysLeft = Math.ceil(
        (item.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft;
}

export default function getExpiryDots(item: Item): string[] {
    if (!item.expiresAt)
        return [Colors.green, Colors.green, Colors.green];

    const daysLeft = checkExpiry(item);

    if (daysLeft <= 0)
        return [];

    if (daysLeft <= 2)
        return [Colors.red, Colors.lightRed, Colors.lightRed];

    if (daysLeft <= 7)
        return [Colors.orange, Colors.orange, Colors.lightOrange];

    if (daysLeft > 7 && daysLeft <= 100)
        return [Colors.green, Colors.green, Colors.green];

    if (daysLeft > 100 && (daysLeft / 2) <= 180)
        return [Colors.green, Colors.green, Colors.green, Colors.green, Colors.lightGreen];

    return [Colors.green, Colors.green, Colors.green, Colors.green, Colors.green];
}

export async function findFoodEmoji(query: string): Promise<string> {
    if (!query) return "📦";

    try {

        const words = query
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(w => w.length >= 3);


        for (const word of words) {
            if (EMOJI_OVERRIDES[word]) {
                return EMOJI_OVERRIDES[word];
            }
        }

        let natureBackup: string | null = null;

        for (const word of words) {
            const results = await SearchIndex.search(word);
            if (!results || results.length === 0) continue;

            const foodMatch = results.find((emoji: any) => foodEmojiIds.has(emoji.id));
            if (foodMatch) {
                return foodMatch.skins[0].native;
            }

            if (!natureBackup) {
                const natureMatch = results.find((emoji: any) => natureEmojiIds.has(emoji.id));
                if (natureMatch) {
                    natureBackup = natureMatch.skins[0].native;
                }
            }
        }

        if (natureBackup) {
            return natureBackup;
        }
    } catch (e) {
        console.warn("Failed to find food emoji", e);
    }

    return "📦";
}

export function groupByCategory(items: Item[]): Section[] {
    const map = new Map<string, Item[]>();
    for (const item of items) {
        const key = item.category ?? "Other";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}