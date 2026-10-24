import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { Graph } from '@/visualization/graph';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RealtimePitchProcessor } from '../pitch-processing/pitch-processor';

export const intonation = new EqualTemperamentIntonation(440)

export default function App() {
  const [pitch, setPitch] = useState<Pitch>(intonation.calculateIntonation(-1))

  return (
    <>
      <RealtimePitchProcessor intonation={intonation} pitch={pitch} setPitch={setPitch}/>
      <View style={styles.container}>
        <Graph pitch={pitch} setPitch={setPitch}/>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#ecf0f1',
  }
});
