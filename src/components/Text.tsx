import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

export type TextProps = RNTextProps;

export function Text(props: TextProps) {
  const { style, ...rest } = props;

  let fontFamily = "Poppins_400Regular";
  let newStyle = { ...StyleSheet.flatten(style || {}) } as any;

  if (newStyle) {
    const weight = newStyle.fontWeight;
    switch (weight) {
      case "100":
        fontFamily = "Poppins_100Thin";
        break;
      case "200":
        fontFamily = "Poppins_200ExtraLight";
        break;
      case "300":
        fontFamily = "Poppins_300Light";
        break;
      case "400":
      case "normal":
        fontFamily = "Poppins_400Regular";
        break;
      case "500":
        fontFamily = "Poppins_500Medium";
        break;
      case "600":
        fontFamily = "Poppins_600SemiBold";
        break;
      case "700":
      case "bold":
        fontFamily = "Poppins_700Bold";
        break;
      case "800":
        fontFamily = "Poppins_800ExtraBold";
        break;
      case "900":
        fontFamily = "Poppins_900Black";
        break;
      default:
        fontFamily = "Poppins_400Regular";
        break;
    }
  }

  if (newStyle && newStyle.fontWeight) {
    delete newStyle.fontWeight;
  }

  return <RNText style={[newStyle, { fontFamily }]} {...rest} />;
}
