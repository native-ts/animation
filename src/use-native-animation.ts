import React, {useMemo, useRef} from 'react';
import {
  Animated,
  Easing,
  EasingFunction,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  NativeAnimationRange,
  NativeAnimationType,
} from './types';

export type UseAnimationValue = 0 | 1;

export type UseNativeAnimationOutputs = Partial<
  Record<NativeAnimationType, NativeAnimationRange>
>;

export type UseNativeAnimationProps = UseNativeAnimationOutputs & {
  initial: UseAnimationValue;
};

export function useNativeValue(defaultValue = 0) {
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
    value: UseAnimationValue,
    duration = 200,
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

export function useNativeAnimation(props?: UseNativeAnimationProps) {
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
      const anim = animation[type as NativeAnimationType](range);

      if (anim.hasOwnProperty('opacity')) {
        acc = {...acc, ...anim};
      } else {
        if (!acc.transform) {
          acc.transform = [];
        }

        (acc.transform as Array<any>).push(anim);
      }
      console.log(anim);
      return acc;
    }, {} as ViewStyle | ImageStyle | TextStyle);

    return result;
  }, [rest, animation]);

  return {
    ...shared,
    ...animation,
    styles,
  };
}
