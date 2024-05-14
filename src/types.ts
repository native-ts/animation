import {Ref} from 'react';
import {
  Animated,
  EasingFunction,
  ImageStyle,
  MatrixTransform,
  MaximumOneOf,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TextStyle,
  TranslateXTransform,
  TranslateYTransform,
  ViewStyle,
} from 'react-native';

export type DefaultBaseStyle = Omit<
  ViewStyle & ImageStyle & TextStyle,
  'backfaceVisibility'
>;

export type TransformProperty = MaximumOneOf<
  PerpectiveTransform &
    RotateTransform &
    RotateXTransform &
    RotateYTransform &
    RotateZTransform &
    ScaleTransform &
    ScaleXTransform &
    ScaleYTransform &
    TranslateXTransform &
    TranslateYTransform &
    SkewXTransform &
    SkewYTransform &
    MatrixTransform
>;

export type NativeDefaultStyle = DefaultBaseStyle & TransformProperty[];

export type DefaultStyle = Omit<DefaultBaseStyle, 'transform'> &
  TransformProperty;

export type ExtrapolateType = 'extend' | 'identity' | 'clamp';

export type NativeAnimationValue = 0 | 1;

export type NativeAnimationRange = [number, number];

export type InterpolateValue = Animated.AnimatedInterpolation<string | number>;

export type NativeAnimationOutputs = {
  [Key in keyof DefaultStyle]: NativeAnimationRange;
};

export interface NativeAnimationInterpolate {
  (
    output: NativeAnimationRange,
    extrapolate?: ExtrapolateType,
  ): InterpolateValue;
}

export interface UseNativeSharedReturn {
  value: Animated.Value;
  interpolate: NativeAnimationInterpolate;
  start(callback?: Animated.EndCallback): void;
  stop(): void;
  timing(
    value: NativeAnimationValue,
    duration?: number,
    delay?: number,
    easing?: EasingFunction,
    callback?: Animated.EndCallback,
  ): void;
}

export type NativeTransformStyle = Array<
  Partial<Record<keyof TransformProperty, InterpolateValue>>
>;

export type UseNativeAnimationProps = NativeAnimationOutputs & {
  initial?: NativeAnimationValue;
};

export type UseNativeAnimationReturn = UseNativeSharedReturn & {
  styles: NativeDefaultStyle;
};

export interface NativeAnimationRef extends UseNativeAnimationReturn {
  play(): void;
}

export type PropsWithNativeAnimation<
  Props = {},
  Anim extends Partial<DefaultStyle> = {},
> = (Props extends {style?: any} ? Props : {style?: any} & Props) & {
  nativeAnimation?: {
    from?: {
      [K in keyof Anim]: Anim[K];
    };
    to?: {
      [K in keyof Anim]: Anim[K];
    };
    initial?: NativeAnimationValue;
    auto?: boolean;
    duration?: number;
    delay?: number;
    loop?: boolean;
    back?: boolean;
    easing?: EasingFunction;
  };
  animationRef?: Ref<NativeAnimationRef>;
};
