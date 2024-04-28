import React, {ComponentType, Ref, forwardRef, useMemo} from 'react';
import {PressableStateCallbackType, StyleSheet} from 'react-native';
import {NativeAnimationRange} from './types';
import {
  UseAnimationValue,
  UseNativeAnimationOutputs,
  useNativeAnimation,
} from './use-native-animation';

export interface AnimationProperty {
  opacity?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  translate?: number;
  translateX?: number;
  translateY?: number;
}

type FromToType<Props = {}, Anim extends AnimationProperty = {}> = Props & {
  from: {
    [K in keyof Anim]: number;
  };
  to: {
    [K in keyof Anim]: number;
  };
};

export type PropsWithAnimation<
  Props = {},
  Anim extends AnimationProperty = {},
> = (Props extends {style?: any} ? Props : {style?: any}) &
  FromToType<Props, Anim> & {
    initial?: UseAnimationValue;
  };

export function withAnimation<Props = {}, RefElement = unknown>(
  Component: ComponentType<Props>,
) {
  return forwardRef(function WithAnimation<Anim extends AnimationProperty = {}>(
    props: PropsWithAnimation<Props, Anim>,
    ref: Ref<RefElement>,
  ) {
    const {from = {}, to = {}, initial = 0, style: propStyle, ...rest} = props;

    const outputs = useMemo(() => {
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
      }, {} as UseNativeAnimationOutputs);
    }, [from, to]);

    const shared = useNativeAnimation({
      initial,
      ...outputs,
    });

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

    return <Component {...(rest as Props)} ref={ref} style={style} />;
  });
}
