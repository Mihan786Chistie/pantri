import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  BAR_MAX_HEIGHT,
  DAY_LABELS,
  WeeklyTrendChartProps,
} from "../constants";

export function WeeklyTrendChart({
  dailyConsumed,
  dailyExpired,
}: WeeklyTrendChartProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly trend</Text>
      </View>

      <View style={styles.chartRow}>
        {DAY_LABELS.map((label, i) => {
          const consumed = dailyConsumed[i] || 0;
          const expired = dailyExpired[i] || 0;
          const total = consumed + expired;
          const barH = total > 0 ? BAR_MAX_HEIGHT : 4;
          const barColor =
            total === 0
              ? Colors.unselected
              : consumed == expired
                ? Colors.orange
                : consumed >= expired
                  ? Colors.green
                  : Colors.red;

          return (
            <View key={`${label}-${i}`} style={styles.barWrapper}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barH,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 16,
    marginHorizontal: 4,
    marginVertical: 6,
    rowGap: 20,
    borderColor: Colors.default,
    borderWidth: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C2C2C",
    letterSpacing: -0.2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  barTrack: {
    height: BAR_MAX_HEIGHT,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  bar: {
    width: 20,
    borderRadius: 9,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#AEA89E",
  },
});
