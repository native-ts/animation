import React, {useEffect} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useNativeAnimation} from './src/use-native-animation';

const {width, height} = Dimensions.get('window');

function App(): React.JSX.Element {
  const animation = useNativeAnimation({
    scale: [0.8, 2],
  });

  useEffect(() => {
    animation.timing(1, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={styles.view}>
          <Animated.View style={[styles.box, animation.styles, {width}]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
});

export default App;
