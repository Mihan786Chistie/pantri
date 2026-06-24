import { Text } from "@/src/components/Text";
import Item from "@/src/db/model/Item";
import WeeklyTrend from "@/src/db/model/WeeklyTrend";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { EmptyStateIllustration } from "@/src/features/items/components/molecules/EmptyStateIllustration";
import { WeeklyTrendChart } from "@/src/features/items/components/molecules/WeeklyTrendChart";
import { ExpiringItemsList } from "@/src/features/items/components/organisms/ExpiringItemsList";
import { PantryBalanceMeter } from "@/src/features/items/components/organisms/PantryBalanceMeter";
import { autoCleanupItems } from "@/src/features/items/services/item.service";
import {
  computeWeeklyTrendData,
  getWeekBounds,
} from "@/src/features/items/utils";
import { Database, Q } from "@nozbe/watermelondb";
import { useDatabase, withObservables } from "@nozbe/watermelondb/react";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface HomeContentProps {
  items: Item[];
  weeklyTrends: WeeklyTrend[];
}

const HomeContent = ({ items, weeklyTrends }: HomeContentProps) => {
  const user = useAuthStore((s) => s.user);
  const [focusTick, setFocusTick] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setFocusTick((t) => t + 1);
    }, []),
  );

  useEffect(() => {
    if (items.length > 0) {
      autoCleanupItems(items);
    }
  }, [items]);

  const insights = useMemo(() => {
    const now = Date.now();
    const thisWeek = getWeekBounds(0);

    let consumedTotal = 0;
    let expiredTotal = 0;

    for (const item of items) {
      if (item.isConsumed) {
        const t = item.consumedAt ? item.consumedAt.getTime() : 0;
        const expiry = item.expiresAt ? item.expiresAt.getTime() : Infinity;
        if (t < expiry) consumedTotal++;
      } else if (item.expiresAt && item.expiresAt.getTime() < now) {
        expiredTotal++;
      }
    }

    const { dailyConsumed, dailyExpired } = computeWeeklyTrendData(
      items,
      weeklyTrends,
      thisWeek.start,
      thisWeek.end,
    );

    return {
      consumedTotal,
      expiredTotal,
      dailyConsumed,
      dailyExpired,
    };
  }, [items, weeklyTrends, focusTick]);

  if (items.length === 0 && weeklyTrends.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <EmptyStateIllustration />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <PantryBalanceMeter
          consumedCount={insights.consumedTotal}
          expiredCount={insights.expiredTotal}
        />

        <WeeklyTrendChart
          dailyConsumed={insights.dailyConsumed}
          dailyExpired={insights.dailyExpired}
        />

        <ExpiringItemsList items={items} weeklyTrends={weeklyTrends} />
      </ScrollView>
    </View>
  );
};

const enhance = withObservables(
  ["userId"],
  ({ database, userId }: { database: Database; userId: string }) => {
    const thisWeek = getWeekBounds(0);
    return {
      items: database
        .get<Item>("items")
        .query(Q.where("user_id", userId))
        .observeWithColumns(["is_consumed", "consumed_at", "expires_at"]),
      weeklyTrends: database
        .get<WeeklyTrend>("weekly_trend")
        .query(
          Q.where("user_id", userId),
          Q.where("date", Q.gte(thisWeek.start)),
          Q.where("date", Q.lt(thisWeek.end)),
        )
        .observe(),
    };
  },
);

const EnhancedHomeContent = enhance(HomeContent);

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const database = useDatabase();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please log in to continue.</Text>
      </View>
    );
  }

  return <EnhancedHomeContent database={database} userId={user.id} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f3",
    padding: 16,
    paddingTop: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B8F5B",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C2C2C",
    letterSpacing: -0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDE6D9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7A746C",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});
