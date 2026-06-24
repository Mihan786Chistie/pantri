import { FilterType } from "../types";

export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
export const BAR_MAX_HEIGHT = 7;

export interface WeeklyTrendChartProps {
  dailyConsumed: number[];
  dailyExpired: number[];
}

export interface InsightStatsCardsProps {
  consumedCount: number;
  expiredCount: number;
  consumedDelta: number;
  expiredDelta: number;
}

export interface MotivationalBannerProps {
  message?: string;
}

export interface PantryBalanceMeterProps {
  consumedCount: number;
  expiredCount: number;
}

export const filters: FilterType[] = ["all"];
export const filterLabels: Record<FilterType, string> = {
  all: "All",
};
