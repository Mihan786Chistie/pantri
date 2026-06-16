import { Colors } from "@/src/constants/colors";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  type SkPath,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  Easing,
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PantryBalanceMeterProps } from "../constants";

function semiArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function PantryBalanceMeter({
  consumedCount,
  expiredCount,
}: PantryBalanceMeterProps) {
  const { width: screenWidth } = useWindowDimensions();

  const GAUGE_W = Math.floor(screenWidth * 0.75);
  const R = GAUGE_W / 2;
  const STROKE_WIDTH = Math.max(20, R * 0.16);
  const CANVAS_H = R * 1.5 + 20;
  const CX = GAUGE_W / 2;
  const CY = R + 10;

  const ARC_START = 160;
  const ARC_END = 380;
  const ARC_SWEEP = ARC_END - ARC_START;

  const PIVOT_X = CX;
  const PIVOT_Y = CY;
  const NEEDLE_L = R - STROKE_WIDTH - 20;

  const total = consumedCount + expiredCount;
  const balance = total === 0 ? 0 : consumedCount / total;
  const needleTargetBalance = total === 0 ? 0.5 : balance;
  const needleAngle = useSharedValue(ARC_START - 270);
  const wobble = useSharedValue(0);

  useEffect(() => {
    const targetDeg = ARC_START + needleTargetBalance * ARC_SWEEP;
    needleAngle.value = withSpring(targetDeg - 270, {
      damping: 20,
      stiffness: 100,
      mass: 1.4,
    });
  }, [needleTargetBalance, ARC_START, ARC_SWEEP, needleAngle]);

  useEffect(() => {
    cancelAnimation(wobble);
    wobble.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-0.4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(wobble);
  }, [wobble]);

  const bgArcPath: SkPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        semiArcPath(CX, CY, R - STROKE_WIDTH / 2, ARC_START, ARC_END),
      )!,
    [CX, CY, R, STROKE_WIDTH, ARC_START, ARC_END],
  );

  const ticksPath = useMemo(() => {
    const path = Skia.Path.Make();
    const numTicks = 24;
    const tickLength = 6;
    const tickRadiusOuter = R - STROKE_WIDTH - 6;
    const tickRadiusInner = tickRadiusOuter - tickLength;
    for (let i = 0; i <= numTicks; i++) {
      const t = i / numTicks;
      const deg = ARC_START + t * ARC_SWEEP;
      const rad = (deg * Math.PI) / 180;
      const x1 = CX + tickRadiusOuter * Math.cos(rad);
      const y1 = CY + tickRadiusOuter * Math.sin(rad);
      const x2 = CX + tickRadiusInner * Math.cos(rad);
      const y2 = CY + tickRadiusInner * Math.sin(rad);
      path.moveTo(x1, y1);
      path.lineTo(x2, y2);
    }
    return path;
  }, [CX, CY, R, STROKE_WIDTH, ARC_START, ARC_SWEEP]);

  const needlePath = useMemo(() => {
    const str = `
      M ${PIVOT_X - 5} ${PIVOT_Y} 
      L ${PIVOT_X - 2.5} ${PIVOT_Y - NEEDLE_L} 
      A 2.5 2.5 0 0 1 ${PIVOT_X + 2.5} ${PIVOT_Y - NEEDLE_L}
      L ${PIVOT_X + 5} ${PIVOT_Y} 
      Z
    `;
    return Skia.Path.MakeFromSVGString(str)!;
  }, [PIVOT_X, PIVOT_Y, NEEDLE_L]);

  const needleTransform = useDerivedValue(() => {
    const deg = needleAngle.value + wobble.value;
    return [{ rotate: (deg * Math.PI) / 180 }];
  });

  const animatedBalance = useDerivedValue(() => {
    const deg = needleAngle.value + wobble.value + 270;
    return Math.max(0, Math.min(1, (deg - ARC_START) / ARC_SWEEP));
  });

  const shouldShowFilled = total > 0 && balance > 0;
  const shouldShowWasted = total > 0 && balance < 1;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.gaugeContainer, { width: GAUGE_W }]}>
        <Canvas style={{ width: GAUGE_W, height: CANVAS_H }}>
          <Path
            path={bgArcPath}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap="round"
            color={Colors.unselected}
          />

          {shouldShowWasted && (
            <Path
              path={bgArcPath}
              start={animatedBalance}
              end={1}
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="round"
              color={Colors.red}
            />
          )}

          {shouldShowFilled && (
            <Path
              path={bgArcPath}
              start={0}
              end={animatedBalance}
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="round"
              color={Colors.green}
            />
          )}

          <Path
            path={ticksPath}
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
            color="#D1D5DB"
          />

          <Group
            origin={{ x: PIVOT_X, y: PIVOT_Y }}
            transform={needleTransform}
          >
            <Path path={needlePath} color="#545D66" />
          </Group>

          <Circle cx={PIVOT_X} cy={PIVOT_Y} r={12} color="#545D66" />
          <Circle cx={PIVOT_X} cy={PIVOT_Y} r={5} color={Colors.unselected} />
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 2,
  },
  gaugeContainer: {
    position: "relative",
  },
});
