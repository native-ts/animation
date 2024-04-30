import {Ref} from 'react';
import {
  Animated,
  EasingFunction,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

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

export interface NativeAnimationInterpolate {
  (output: NativeAnimationRange): Animated.AnimatedInterpolation<
    string | number
  >;
}

export interface NativeAnimationMakeProps<
  Key extends keyof NativeAnimationProperty,
> {
  (output: NativeAnimationRange): {
    [K in Key]: Animated.AnimatedInterpolation<string | number>;
  };
}

export type UseNativeAnimationProps = NativeAnimationOutputs & {
  initial: NativeAnimationValue;
};

export interface UseNativeValueReturn {
  value: Animated.Value;
  interpolate: NativeAnimationInterpolate;
  opacity: NativeAnimationMakeProps<'opacity'>;
  scale: NativeAnimationMakeProps<'scale'>;
  scaleX: NativeAnimationMakeProps<'scaleX'>;
  scaleY: NativeAnimationMakeProps<'scaleY'>;
  translate: NativeAnimationMakeProps<'translate'>;
  translateX: NativeAnimationMakeProps<'translateX'>;
  translateY: NativeAnimationMakeProps<'translateY'>;
  start(callback?: Animated.EndCallback): void;
  stop(): void;
  timing: (
    value: NativeAnimationValue,
    duration?: number,
    delay?: number,
    easing?: EasingFunction,
    callback?: Animated.EndCallback,
  ) => void;
}

export interface UseNativeAnimationReturn extends UseNativeValueReturn {
  styles: DefaultStyle;
}

export interface NativeAnimationRef extends UseNativeAnimationReturn {
  play(): void;
}

export type PropsWithNativeAnimation<
  Props = {},
  Anim extends NativeAnimationProperty = {},
> = (Props extends {style?: any} ? Props : {style?: any} & Props) & {
  nativeAnimation?: {
    from?: {
      [K in keyof Anim]: number;
    };
    to?: {
      [K in keyof Anim]: number;
    };
    initial?: NativeAnimationValue;
    auto?: boolean;
    loop?: boolean;
    back?: boolean;
    duration?: number;
    delay?: number;
  };
  animationRef?: Ref<NativeAnimationRef>;
};
