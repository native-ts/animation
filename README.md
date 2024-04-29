# Native Animation

This package is simple animation for React Native, only using React Native Animated to make animation.

**[Try with Expo](https://snack.expo.dev/@ngvcanh/native-ts-animation)**

## Installation

```
npm i --save @native-ts/animation
```

OR

```
yarn add @native-ts/animation
```

## Using

### Using with hook

```tsx
import React from 'react';
import {Animated, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {useNativeAnimation} from '@native-ts/animation';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function App() {
  const {styles, timing} = useNativeAnimation({
    initial: 0,
    scale: [0.8, 1],
  });

  useEffect(() => {
    timing(1);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >
          <AnimatedText style={styles}>Animated</AnimatedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Using with HOC

```tsx
import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {withNativeAnimation} from '@native-ts/animation';

const AnimatedText = withNativeAnimation(Text);

export default function App() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 20,
          }}
        >
          <AnimatedText
            nativeAnimation={{
              from: {scale: 0.8},
              to: {scale: 1},
              auto: true,
              loop: true,
              back: true,
              duration: 1000,
            }}
          >Animated</AnimatedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### useNativeValue

`useNativeValue` is a hook that creates a value with the initial value being the value passed into the hook.

The initial value can only be `0` or `1`.

This hook will return an object of type `UseNativeValueReturn`.

```ts
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
  timing: (value: NativeAnimationValue, duration?: number, easing?: EasingFunction, callback?: Animated.EndCallback) => void;
}
```

- `value`: Value created from `Animated.Value`;
- `interpolate`: is customized from `value.interpolate` but only accepts `output` parameters.
- `opacity`, `scale`, `scaleX`, `scaleY`, `translate`, `translateX`, `translateY`: These functions create a corresponding `StyleSheet` object whose value is an `Animated.Value`.
- `start`: This function initiates a `timing` function call. It will call the stop function before it starts calling the `timing` function.
- `stop`: This function stops calling the `timing` function.
- `timing`: This function customizes the `Animated.timing` function;

### useNativeAnimation

This `useNativeAnimation` will use the `useNativeValue` hook, then create a styles object with the Animated.Value values of the StyleSheet property declared in the passed props.

Its return value includes the entirety of `useNativeValue` and the generated `styles` object.

```ts
export interface UseNativeAnimationReturn extends UseNativeValueReturn {
  styles: DefaultStyle;
}
```

### withNativeAnimation

This is a HOC that takes as input a React Component and will create an Animated Component using `useNativeAnimation` to create animations and manage them through 2 new props, `nativeAnimation` and `animationRef`.

```ts
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
  animationRef?: Ref<NativeAnimationRef>;
};

export interface NativeAnimationProperty {
  opacity?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  translate?: number;
  translateX?: number;
  translateY?: number;
}

export interface NativeAnimationRef extends UseNativeAnimationReturn {
  play(): void;
}
```