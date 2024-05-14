import {useRef} from 'react';
import {Animated, Easing, EasingFunction} from 'react-native';
import {
  NativeAnimationInterpolate,
  NativeAnimationValue,
  UseNativeSharedReturn,
} from './types';
import {
  NATIVE_ANIMATION_DEFAULT_DELAY,
  NATIVE_ANIMATION_DEFAULT_DURATION,
} from './utils';

export function useNativeShared(defaultValue = 0): UseNativeSharedReturn {
  const animated = useRef(new Animated.Value(defaultValue));
  const composite = useRef<Animated.CompositeAnimation>();

  const interpolate: NativeAnimationInterpolate = (
    output,
    extrapolate = 'clamp',
  ) =>
    animated.current.interpolate({
      inputRange: [0, 1],
      outputRange: output,
      extrapolate,
    });

  const stop = () => composite.current && composite.current.stop();

  const start = (callback?: Animated.EndCallback) =>
    composite.current && composite.current.start(callback);

  const timing = (
    value: NativeAnimationValue,
    duration = NATIVE_ANIMATION_DEFAULT_DURATION,
    delay = NATIVE_ANIMATION_DEFAULT_DELAY,
    easing: EasingFunction = Easing.linear,
    callback?: Animated.EndCallback,
  ) => {
    stop();
    composite.current = Animated.timing(animated.current, {
      toValue: value,
      duration,
      useNativeDriver: true,
      easing,
      delay,
    });
    start(callback);
  };

  return {
    value: animated.current,
    interpolate,
    stop,
    start,
    timing,
  };
}
