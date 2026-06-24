import { Text } from "@/src/components/Text";
import { Colors } from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface DatePickerSectionProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const DatePickerSection = ({
  value,
  onChange,
}: DatePickerSectionProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value);

  const getPresetDate = (days: number): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d;
  };

  const presets = [
    { label: "+3 Days", days: 3 },
    { label: "+1 Week", days: 7 },
    { label: "+2 Weeks", days: 14 },
  ];

  const getRelativeDateString = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow (1 Day)";

    const dayOfWeek = target.toLocaleDateString("en-US", { weekday: "long" });

    if (diffDays < 7) {
      return `This ${dayOfWeek} (${diffDays} Days)`;
    } else if (diffDays < 14) {
      return `Next ${dayOfWeek} (${diffDays} Days)`;
    }

    return `In ${diffDays} Days`;
  };

  const formatMonthDay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePresetPress = (days: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onChange(getPresetDate(days));
  };

  const handleAndroidChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleIosDone = () => {
    onChange(tempDate);
    setShowPicker(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
  };

  const handleOpenPicker = () => {
    setTempDate(value);
    setShowPicker(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const getSelectedPresetIndex = () => {
    const valTime = new Date(value).setHours(0, 0, 0, 0);
    return presets.findIndex((p) => {
      const pTime = getPresetDate(p.days).getTime();
      return Math.abs(valTime - pTime) < 60 * 60 * 1000;
    });
  };

  const activeIndex = getSelectedPresetIndex();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleOpenPicker}
        style={styles.card}
      >
        <View style={styles.cardRow}>
          <View style={styles.dateCol}>
            <Text style={styles.dateTitle}>{formatMonthDay(value)}</Text>
            <Text style={styles.relativeSub}>
              {getRelativeDateString(value)}
            </Text>
          </View>

          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={20} color={Colors.green} />
          </View>
        </View>

        <View style={styles.presetsContainer}>
          {presets.map((p, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <TouchableOpacity
                key={p.label}
                activeOpacity={0.7}
                onPress={() => handlePresetPress(p.days)}
                style={[
                  styles.presetChip,
                  isSelected ? styles.presetSelected : styles.presetUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.presetText,
                    isSelected
                      ? styles.presetTextSelected
                      : styles.presetTextUnselected,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowPicker(false)}
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.headerBtn}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Expiry</Text>
                <TouchableOpacity
                  onPress={handleIosDone}
                  style={styles.headerBtn}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(_, date) => date && setTempDate(date)}
                themeVariant="light"
                minimumDate={new Date()}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={handleAndroidChange}
          minimumDate={new Date()}
          themeVariant="light"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderWidth: 1.2,
    borderColor: Colors.default,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateCol: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 35,
    fontWeight: "600",
    color: "#1a1a1b",
    letterSpacing: -0.6,
  },
  relativeSub: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.green,
    marginTop: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: Colors.green,
  },
  presetsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  presetSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.green,
  },
  presetUnselected: {
    backgroundColor: "#f5f5f3",
    borderColor: Colors.default,
  },
  presetText: {
    fontSize: 13,
    fontWeight: "600",
  },
  presetTextSelected: {
    color: Colors.background,
  },
  presetTextUnselected: {
    color: Colors.default,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0ee",
  },
  headerBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.default,
    fontWeight: "500",
  },
  doneText: {
    fontSize: 15,
    color: Colors.green,
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
});
