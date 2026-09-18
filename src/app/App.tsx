import yin from '@/pitch-processing/audiojs-yin';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const DECIMAL_PLACES = 2


export default function App() {
  const [freq, setFreq] = useState<number>()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(localMediaStream => {
        let audioContext = new AudioContext()
        let source = audioContext.createMediaStreamSource(localMediaStream)
        let analyser = audioContext.createAnalyser()
  
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        analyser.fftSize = 2048
    
        let bufferLength = analyser.frequencyBinCount
        // let frequencyData = new Uint8Array(bufferLength)
        let timeFreqData = new Float32Array(bufferLength)
        let timeDomainData = new Float32Array(bufferLength)
  
        setInterval(() => {
          // analyser.getByteFrequencyData(frequencyData)
          analyser.getFloatFrequencyData(timeFreqData)
          analyser.getFloatTimeDomainData(timeDomainData)

          const freq = yin(timeDomainData, { fs: audioContext.sampleRate })?.freq
          
          setFreq(
            Math.round((freq ?? 0) * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES)  
          )
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
