import { Colors } from "@/src/constants/colors";
import Item from "@/src/db/model/Item";
import WeeklyTrend from "@/src/db/model/WeeklyTrend";
import { Section } from "@/src/features/items/types";
import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";

init({ data });

export const POPULAR_FOOD_EMOJIS = [
  "🍎",
  "🍏",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🥝",
  "🥥",
  "🍈",
  "🍍",
  "🥭",
  "🍐",
  "🍑",
  "🫒",
  "🍆",
  "🫑",
  "🍄",
  "🥒",
  "🫚",
  "🫛",
  "🥜",
  "🫘",
  "🍊",
  "🍋",
  "🥑",
  "🥦",
  "🥬",
  "🥫",
  "🥕",
  "🍅",
  "🥔",
  "🧅",
  "🧄",
  "🌶️",
  "🌽",
  "🥚",
  "🧀",
  "🥛",
  "🧈",
  "🥩",
  "🍗",
  "🍖",
  "🥓",
  "🐟",
  "🍤",
  "🍞",
  "🥐",
  "🥯",
  "🥞",
  "🧇",
  "🍕",
  "🍔",
  "🌮",
  "🥘",
  "🍲",
  "🍚",
  "🌾",
  "🍜",
  "🍝",
  "🍰",
  "🍩",
  "🍪",
  "🍫",
  "🍯",
  "🧂",
  "🫙",
  "🧃",
  "☕",
  "🍵",
  "🍺",
  "🍷",
  "💊",
  "📦",
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
    (item.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return daysLeft;
}

export default function getExpiryDots(item: Item): string[] {
  if (!item.expiresAt) return [Colors.green, Colors.green, Colors.green];

  const daysLeft = checkExpiry(item);

  if (daysLeft <= 0) return [];

  if (daysLeft <= 2) return [Colors.red, Colors.lightRed, Colors.lightRed];

  if (daysLeft <= 7) return [Colors.orange, Colors.orange, Colors.lightOrange];

  if (daysLeft > 7 && daysLeft <= 100)
    return [Colors.green, Colors.green, Colors.green];

  if (daysLeft > 100 && daysLeft / 2 <= 180)
    return [
      Colors.green,
      Colors.green,
      Colors.green,
      Colors.green,
      Colors.lightGreen,
    ];

  return [Colors.green, Colors.green, Colors.green, Colors.green, Colors.green];
}

export async function findFoodEmoji(query: string): Promise<string> {
  if (!query) return "📦";

  try {
    const words = query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    for (const word of words) {
      if (EMOJI_OVERRIDES[word]) {
        return EMOJI_OVERRIDES[word];
      }
    }

    let natureBackup: string | null = null;

    for (const word of words) {
      const results = await SearchIndex.search(word);
      if (!results || results.length === 0) continue;

      const foodMatch = results.find((emoji: any) =>
        foodEmojiIds.has(emoji.id),
      );
      if (foodMatch) {
        return foodMatch.skins[0].native;
      }

      if (!natureBackup) {
        const natureMatch = results.find((emoji: any) =>
          natureEmojiIds.has(emoji.id),
        );
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

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getWeekBounds(weeksAgo: number): {
  start: number;
  end: number;
} {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  sunday.setHours(0, 0, 0, 0);

  return { start: monday.getTime(), end: sunday.getTime() };
}

export function getDayIndex(timestamp: number, weekStart: number): number {
  const diff = timestamp - weekStart;
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export function getRandomEmoji(emojis: string[]) {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

export function computeWeeklyTrendData(
  items: Item[],
  trends: WeeklyTrend[],
  weekStart: number,
  weekEnd: number,
) {
  const dailyConsumed = [0, 0, 0, 0, 0, 0, 0];
  const dailyExpired = [0, 0, 0, 0, 0, 0, 0];

  for (const item of items) {
    if (item.isConsumed) {
      const t = (item as Item).consumedAt
        ? (item as Item).consumedAt.getTime()
        : 0;
      const expiry = item.expiresAt ? item.expiresAt.getTime() : Infinity;
      if (t < expiry && t >= weekStart && t < weekEnd) {
        const dayIdx = getDayIndex(t, weekStart);
        if (dayIdx >= 0 && dayIdx < 7) dailyConsumed[dayIdx]++;
      }
    } else if (item.expiresAt && item.expiresAt.getTime() < Date.now()) {
      const expT = item.expiresAt.getTime();
      if (expT >= weekStart && expT < weekEnd) {
        const dayIdx = getDayIndex(expT, weekStart);
        if (dayIdx >= 0 && dayIdx < 7) dailyExpired[dayIdx]++;
      }
    }
  }

  for (const trend of trends) {
    const t = trend.date.getTime();
    if (t >= weekStart && t < weekEnd) {
      const dayIdx = getDayIndex(t, weekStart);
      if (dayIdx >= 0 && dayIdx < 7) {
        if (trend.type === "consumed") dailyConsumed[dayIdx]++;
        else if (trend.type === "expired") dailyExpired[dayIdx]++;
      }
    }
  }

  return { dailyConsumed, dailyExpired };
}
