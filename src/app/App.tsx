import yin from '@/pitch-processing/audiojs-yin';
import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const DECIMAL_PLACES = 2
const intonation = new EqualTemperamentIntonation(440)

export default function App() {
  const [freq, setFreq] = useState<number>()
  const [pitch, setPitch] = useState<Pitch>()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(localMediaStream => {
        let audioContext = new AudioContext()
        let source = audioContext.createMediaStreamSource(localMediaStream)
        let analyser = audioContext.createAnalyser()
  
        source.connect(analyser)
        analyser.connect(audioContext.destination)

        let bufferLength = analyser.frequencyBinCount
        let timeDomainData = new Float32Array(bufferLength)
  
        setInterval(() => {
          analyser.getFloatTimeDomainData(timeDomainData)

          const freq = yin(timeDomainData, { fs: audioContext.sampleRate })?.freq
          
          setFreq(
            Math.round((freq ?? 0) * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES)  
          )

          setPitch(freq ? intonation.calculateIntonation(freq) : undefined)
        }, 50)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.text}>
          <Text>{freq}</Text>
          <Text>hz</Text>
        </View>
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
  text: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
