import { Colors } from "@/src/constants/colors";
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  RoundedRect,
  Skia,
  vec,
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

  const GAUGE_W = Math.floor(screenWidth * 0.7);
  const R = GAUGE_W / 2;
  const STROKE_WIDTH = Math.max(18, R * 0.14);
  const CANVAS_H = R + 48;
  const CX = GAUGE_W / 2;
  const CY = R + 10;

  const ARC_START = 200;
  const ARC_END = 340;
  const ARC_SWEEP = ARC_END - ARC_START;

  const PIVOT_X = CX;
  const PIVOT_Y = CY;
  const NEEDLE_L = R + 2;

  const total = consumedCount + expiredCount;
  const balance = total === 0 ? 0 : consumedCount / total;
  const needleAngle = useSharedValue(ARC_START - 270);
  const wobble = useSharedValue(0);

  useEffect(() => {
    const targetDeg = ARC_START + balance * ARC_SWEEP;
    needleAngle.value = withSpring(targetDeg - 270, {
      damping: 20,
      stiffness: 100,
      mass: 1.4,
    });
  }, [balance]);

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
  }, []);

  const bgArcPath: SkPath = useMemo(
    () =>
      Skia.Path.MakeFromSVGString(
        semiArcPath(CX, CY, R - STROKE_WIDTH / 2, ARC_START, ARC_END),
      )!,
    [CX, CY, R, STROKE_WIDTH],
  );

  const filledArcPath: SkPath | null = useMemo(() => {
    if (total === 0 || balance <= 0) return null;
    const endDeg = ARC_START + balance * ARC_SWEEP;
    return Skia.Path.MakeFromSVGString(
      semiArcPath(CX, CY, R - STROKE_WIDTH / 2, ARC_START, endDeg),
    );
  }, [CX, CY, R, STROKE_WIDTH, balance, total]);

  const wastedArcPath: SkPath | null = useMemo(() => {
    if (total === 0 || balance >= 1) return null;
    const startDeg = ARC_START + balance * ARC_SWEEP;
    return Skia.Path.MakeFromSVGString(
      semiArcPath(CX, CY, R - STROKE_WIDTH / 2, startDeg, ARC_END),
    );
  }, [CX, CY, R, STROKE_WIDTH, balance, total]);

  const needleTransform = useDerivedValue(() => {
    const deg = needleAngle.value + wobble.value;
    return [{ rotate: (deg * Math.PI) / 180 }];
  });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.gaugeContainer, { width: GAUGE_W }]}>
        <Canvas style={{ width: GAUGE_W, height: CANVAS_H }}>
          <Path
            path={bgArcPath}
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap="butt"
            color="#E8DFD0"
          >
            <LinearGradient
              start={vec(0, CY)}
              end={vec(GAUGE_W, CY)}
              colors={["#D9D0C2", "#E8DFD0", "#D9CEBB"]}
            />
          </Path>

          {filledArcPath && (
            <Path
              path={filledArcPath}
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="butt"
              color="#74C542"
            >
              <LinearGradient
                start={vec(0, CY)}
                end={vec(GAUGE_W, CY)}
                colors={["#74C542", Colors.green, Colors.green]}
              />
            </Path>
          )}

          {wastedArcPath && (
            <Path
              path={wastedArcPath}
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="butt"
              color="#Colors.red"
            >
              <LinearGradient
                start={vec(0, CY)}
                end={vec(GAUGE_W, CY)}
                colors={[Colors.red, Colors.red, "#D96B52"]}
              />
            </Path>
          )}

          <Path
            path={bgArcPath}
            style="stroke"
            strokeWidth={STROKE_WIDTH + 2}
            strokeCap="round"
            color="rgba(0,0,0,0.04)"
          >
            <BlurMask blur={6} style="inner" />
          </Path>

          <Group
            origin={{ x: PIVOT_X, y: PIVOT_Y }}
            transform={needleTransform}
          >
            <RoundedRect
              x={PIVOT_X - 2.5}
              y={PIVOT_Y - NEEDLE_L}
              width={5}
              height={NEEDLE_L + 2}
              r={2.5}
              color="rgba(0,0,0,0.15)"
            >
              <BlurMask blur={4} style="normal" />
            </RoundedRect>

            <RoundedRect
              x={PIVOT_X - 1.8}
              y={PIVOT_Y - NEEDLE_L}
              width={3.6}
              height={NEEDLE_L}
              r={1.8}
              color={Colors.default}
            >
              <LinearGradient
                start={vec(PIVOT_X - 2, 0)}
                end={vec(PIVOT_X + 2, 0)}
                colors={["#D96B52", "#A83C2C"]}
              />
            </RoundedRect>

            <Circle cx={PIVOT_X} cy={PIVOT_Y} r={7} color="#E2D9C6" />
            <Circle
              cx={PIVOT_X - 1}
              cy={PIVOT_Y - 1.5}
              r={2}
              color="rgba(255,255,255,0.6)"
            />
          </Group>
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
  percentOverlay: {
    position: "absolute",
    alignItems: "center",
  },
  percentText: {
    fontSize: 44,
    fontWeight: "800",
    color: "#2C2C2C",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  percentSubtext: {
    fontSize: 13,
    color: "#AEA89E",
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.1,
  },
  endpointLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -12,
    paddingHorizontal: 8,
  },
  endpointLabel: {
    fontSize: 11,
    color: "#C4BAA4",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
