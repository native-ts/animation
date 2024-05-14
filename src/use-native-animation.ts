import {useMemo} from 'react';
import {
  // DefaultStyle,
  NativeAnimationRange,
  NativeDefaultStyle,
  // NativeAnimationStyle,
  NativeTransformStyle,
  TransformProperty,
  UseNativeAnimationProps,
  UseNativeAnimationReturn,
} from './types';
import {useNativeShared} from './use-native-shared';
import {reduce} from './utils';

const transformKeys = [
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'skewX',
  'skewY',
  'matrix',
];

export function useNativeAnimation(
  props?: UseNativeAnimationProps,
): UseNativeAnimationReturn {
  const {initial, ...rest} = props || {};
  const shared = useNativeShared(initial);

  const styles = useMemo(
    () =>
      reduce<NativeDefaultStyle>(rest, (acc, key) => {
        const value = rest[
          key as keyof typeof rest
        ] as unknown as NativeAnimationRange;

        if (transformKeys.includes(key)) {
          if (!Array.isArray(acc.transform)) {
            acc = Object.assign(acc, {transform: []});
          }

          (acc.transform as NativeTransformStyle)?.push({
            [key as keyof Partial<TransformProperty>]:
              shared.interpolate(value),
          });

          return acc;
        }

        acc[key as any] = shared.interpolate(value) as any;
      }),
    [rest, shared],
  );

  return {
    ...shared,
    styles,
  };
}
