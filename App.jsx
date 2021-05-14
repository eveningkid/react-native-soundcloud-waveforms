import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import WaveForms from './src/WaveForms';
import { getWaveForms } from './src/utils';

const WAVEFORMS = getWaveForms();

// function findNearestMultiple(n, multiple) {
//   'worklet';
//   return Math.floor(n / multiple) * multiple;
// }

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: '50%',
          }}
        >
          <WaveForms waveForms={WAVEFORMS} />
          <WaveForms waveForms={WAVEFORMS} reversed />
        </View>
      </SafeAreaView>
    </>
  );
}

