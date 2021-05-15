import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import WaveForms from './src/WaveForms';
import { getWaveForms } from './src/utils';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { STICK_FULL_WIDTH } from './src/constants';

const WAVEFORMS = getWaveForms();

function findNearestMultiple(n, multiple) {
  'worklet';
  return Math.floor(n / multiple) * multiple;
}

export default function App() {
  const dimensions = useWindowDimensions();

  const playing = useSharedValue(false);
  const sliding = useSharedValue(false);

  const panX = useSharedValue(0);
  const maxPanX = -dimensions.width;

  const updateProgress = () => {
    'worklet';

    if (playing.value && !sliding.value && panX.value > maxPanX) {
      panX.value = withTiming(panX.value - STICK_FULL_WIDTH);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => updateProgress(), 150);
    return () => clearInterval(interval);
  }, []);

  const tapGestureHandler = useAnimatedGestureHandler({
    onActive() {
      playing.value = !playing.value;
    },
  });

  const panGestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startX = panX.value;
      sliding.value = true;
    },
    onActive(event, context) {
      const nextPanX = context.startX + event.translationX;

      if (nextPanX > 0) {
        panX.value = 0;
      } else if (nextPanX < maxPanX) {
        panX.value = maxPanX;
      } else {
        panX.value = nextPanX;
      }
    },
    onEnd() {
      panX.value = withTiming(
        findNearestMultiple(panX.value, STICK_FULL_WIDTH)
      );

      sliding.value = false;
    },
  });

  const maskAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: panX.value,
        },
      ],
    };
  });

  const playedAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: -panX.value,
    };
  });

  const topWavesAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(playing.value ? 50 : 1),
    };
  });

  const bottomWavesAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(playing.value ? 40 : 1),
    };
  });

  return (
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <TapGestureHandler
          numberOfTaps={1}
          onGestureEvent={tapGestureHandler}
        >
          <Animated.View style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={[{ flex: 1 }, maskAnimatedStyle]}>
                <MaskedView
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <Animated.View style={topWavesAnimatedStyle}>
                        <WaveForms waveForms={WAVEFORMS} />
                      </Animated.View>

                      <Animated.View style={bottomWavesAnimatedStyle}>
                        <WaveForms waveForms={WAVEFORMS} reversed />
                      </Animated.View>
                    </View>
                  }
                  style={{
                    height: '100%',
                    width: '100%',
                    marginLeft: '50%',
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        position: 'absolute',
                        zIndex: 1,
                        left: 0,
                        bottom: 0,
                        top: 0,
                        backgroundColor: '#FF5836',
                      },
                      playedAnimatedStyle,
                    ]}
                  />

                  <View
                    style={{ flex: 1, backgroundColor: 'white' }}
                  />
                </MaskedView>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </SafeAreaView>
    </>
  );
}

