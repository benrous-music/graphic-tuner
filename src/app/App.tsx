import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AudioProcessor from '../pitch-processing/audio-processor';

export default function App() {
  const [freq, setFreq] = useState<number>()

  const processor = new AudioProcessor()
  processor.onNoteDetected = (frequency: number) => {
    setFreq(Math.round(frequency))
  }

  function toggleMic() {
    if (!processor.isRunning) { processor.start() }
    else { processor.stop() }
  }

  return (
    <View style={styles.container}>
      <Button title="Start" onPress={() => toggleMic()}/>
      <View>
        <Text>
          {freq} hz
        </Text>
      </View>
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
  },
});
