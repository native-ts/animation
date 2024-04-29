import {ImageStyle, TextStyle, ViewStyle} from "react-native";

export type DefaultStyle = ViewStyle | ImageStyle | TextStyle;

export type NativeAnimationType =
  | 'none'
  | 'fade'
  | 'zoomIn'
  | 'zoomOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight';

export type NativeAnimationValue = 0 | 1;

export type NativeAnimationRange = [number, number];

export interface NativeAnimationProperty {
  opacity?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  translate?: number;
  translateX?: number;
  translateY?: number;
}

export type NativeAnimationOutputs = Partial<
  Record<NativeAnimationType, NativeAnimationRange>
>;
