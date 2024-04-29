import {useMemo, useRef} from 'react';
import {
  Animated,
  Easing,
  EasingFunction,
} from 'react-native';
import {
  DefaultStyle,
  NativeAnimationRange,
  NativeAnimationType,
  NativeAnimationValue,
  UseNativeAnimationProps,
  UseNativeAnimationReturn,
  UseNativeValueReturn,
} from './types';

const assignStyle = (
  acc: DefaultStyle,
  style: Animated.AnimatedInterpolation<string | number>,
) => {
  if (style.hasOwnProperty('opacity')) {
    acc = {...acc, ...style};
    return acc;
  }

  if (!acc.transform) {
    acc.transform = [];
  }

  (acc.transform as Array<any>).push(style);
  return acc;
};

export const NATIVE_ANIMATION_DEFAULT_DURATION = 150;

export function useNativeValue(defaultValue = 0): UseNativeValueReturn {
  const animated = useRef(new Animated.Value(defaultValue));
  const composite = useRef<Animated.CompositeAnimation>();

  const interpolate = (output: NativeAnimationRange) =>
    animated.current.interpolate({
      inputRange: [0, 1],
      outputRange: output,
    });

  const opacity = (output: NativeAnimationRange) => ({
    opacity: interpolate(output),
  });

  const scale = (output: NativeAnimationRange) => ({
    scale: interpolate(output),
  });

  const scaleX = (output: NativeAnimationRange) => ({
    scaleX: interpolate(output),
  });

  const scaleY = (output: NativeAnimationRange) => ({
    scaleY: interpolate(output),
  });

  const translate = (output: NativeAnimationRange) => ({
    translate: interpolate(output),
  });

  const translateX = (output: NativeAnimationRange) => ({
    translateX: interpolate(output),
  });

  const translateY = (output: NativeAnimationRange) => ({
    translateY: interpolate(output),
  });

  const stop = () => composite.current && composite.current.stop();

  const start = (callback?: Animated.EndCallback) =>
    composite.current && composite.current.start(callback);

  const timing = (
    value: NativeAnimationValue,
    duration = NATIVE_ANIMATION_DEFAULT_DURATION,
    easing: EasingFunction = Easing.linear,
    callback?: Animated.EndCallback,
  ) => {
    stop();
    composite.current = Animated.timing(animated.current, {
      toValue: value,
      duration,
      useNativeDriver: true,
      easing,
    });
    start(callback);
  };

  return {
    value: animated.current,
    interpolate,
    opacity,
    scale,
    scaleX,
    scaleY,
    translate,
    translateX,
    translateY,
    start,
    stop,
    timing,
  };
}

export function useNativeAnimation(
  props?: UseNativeAnimationProps,
): UseNativeAnimationReturn {
  const {initial = 0, ...rest} = props || {};
  const shared = useNativeValue(initial);

  const animation = useMemo(
    () => ({
      none: () => ({}),
      zoomIn: shared.scale,
      zoomOut: shared.scale,
      fade: shared.opacity,
      slideUp: shared.translateY,
      slideDown: shared.translateY,
      slideLeft: shared.translateX,
      slideRight: shared.translateX,
    }),
    [shared],
  );

  const styles = useMemo(() => {
    const result = Object.keys(rest).reduce((acc, type) => {
      const range = rest[type as keyof typeof rest] as NativeAnimationRange;
      const fnAnim = animation[type as NativeAnimationType];

      if (fnAnim === undefined) {
        const styleFn = shared[type as keyof typeof shared];

        if (typeof styleFn !== 'function') {
          return acc;
        }

        return assignStyle(acc, styleFn(range as any) as any);
      } else {
        const anim = fnAnim(range) as Animated.AnimatedInterpolation<
          string | number
        >;

        return assignStyle(acc, anim);
      }
    }, {} as DefaultStyle);

    return result;
  }, [rest, animation, shared]);

  return {
    ...shared,
    styles,
  };
}
