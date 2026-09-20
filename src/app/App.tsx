import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PitchReadout from './pitch-readout';

export default function App() {
  const intonation = new EqualTemperamentIntonation(440)
  const [pitch, setPitch] = useState<Pitch>(intonation.calculateIntonation(-1))

  return (
    <View style={styles.container}>
      <PitchReadout intonation={intonation} pitch={pitch} setPitch={setPitch}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  }
});
