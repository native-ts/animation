/* eslint-disable react-hooks/exhaustive-deps */
import React, {ComponentType, Ref, forwardRef, useEffect, useMemo} from 'react';
import {Animated, PressableStateCallbackType, StyleSheet} from 'react-native';
import {
  NativeAnimationOutputs,
  NativeAnimationProperty,
  NativeAnimationRange,
  NativeAnimationValue
} from './types';
import {
  NATIVE_ANIMATION_DEFAULT_DURATION,
  useNativeAnimation,
} from './use-native-animation';

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
  };
};

export function withNativeAnimation<Props = {}, RefElement = unknown>(
  Component: ComponentType<Props>,
) {
  const AnimatedComponent = Animated.createAnimatedComponent(Component);

  return forwardRef(function WithNativeAnimation<
    Anim extends NativeAnimationProperty = {},
  >(props: PropsWithNativeAnimation<Props, Anim>, ref: Ref<RefElement>) {
    const {style: propStyle, nativeAnimation = {}, ...rest} = props;

    const outputs = useMemo(() => {
      const {from = {}, to = {}} = nativeAnimation;

      const keysFrom = Object.keys(from);
      const keysTo = Object.keys(to);

      if (keysFrom.length !== keysTo.length) {
        throw new Error('The properties of "from" and "to" must be the same');
      }

      return keysFrom.reduce((acc, key) => {
        const fromValue = from[key as keyof typeof from];
        const toValue = to[key as keyof typeof to];

        if (toValue === undefined || fromValue === undefined) {
          throw new Error('The properties of "from" and "to" must be the same');
        }

        acc[key as keyof typeof acc] = [
          fromValue,
          toValue,
        ] as NativeAnimationRange;

        return acc;
      }, {} as NativeAnimationOutputs);
    }, [nativeAnimation]);

    const shared = useNativeAnimation({
      initial: nativeAnimation.initial ?? 0,
      ...outputs,
    });

    const play = () => {
      const {
        initial = 0,
        duration = NATIVE_ANIMATION_DEFAULT_DURATION,
        back,
        loop,
      } = nativeAnimation;

      shared.value.setValue(initial);

      const nativeDuration =
        duration <= 0 ? NATIVE_ANIMATION_DEFAULT_DURATION : duration;
      const value = Math.abs(initial - 1) as NativeAnimationValue;

      shared.timing(value, nativeDuration);
      let loopDuration = nativeDuration;

      if (back) {
        setTimeout(
          () => shared.timing(initial, nativeDuration),
          nativeDuration,
        );
        loopDuration += nativeDuration;
      }

      if (loop) {
        setTimeout(() => play(), loopDuration);
      }
    };

    useEffect(() => {
      if (!nativeAnimation.auto) {
        return;
      }

      play();
    }, []);

    const style = useMemo(() => {
      if (typeof propStyle === 'function') {
        return (state: PressableStateCallbackType) => {
          return [
            StyleSheet.flatten(propStyle(state)),
            StyleSheet.flatten(shared.styles),
          ];
        };
      }
      return [StyleSheet.flatten(propStyle), StyleSheet.flatten(shared.styles)];
    }, [shared, propStyle]);

    return <AnimatedComponent {...(rest as any)} ref={ref} style={style} />;
  });
}
