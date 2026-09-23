import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { Graph } from '@/visualization/graph';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PitchReadout } from './pitch-readout';

export const intonation = new EqualTemperamentIntonation(440)

export default function App() {
  const [pitch, setPitch] = useState<Pitch>(intonation.calculateIntonation(-1))

  return (
    <View style={styles.container}>
      <PitchReadout intonation={intonation} pitch={pitch} setPitch={setPitch}/>
      <Graph  pitch={pitch} setPitch={setPitch}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#ecf0f1',
  }
});
