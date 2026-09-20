import yin from '@/pitch-processing/audiojs-yin';
import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const DECIMAL_PLACES = 2

function precision(n: number): number {
  return Math.round(n * (10 ** DECIMAL_PLACES)) / (10 ** DECIMAL_PLACES)
}


export default function PitchReadout(props: {
  pitch: Pitch,
  setPitch: React.Dispatch<React.SetStateAction<Pitch>>,
  intonation: EqualTemperamentIntonation
}) {
  const [pitch, setPitch] = [props.pitch, props.setPitch]
  const intonation = props.intonation

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

          const freq = yin(timeDomainData, { fs: audioContext.sampleRate })?.freq ?? -1;
          
          setPitch(intonation.calculateIntonation(freq))
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
          <Text>{precision(pitch.frequency)}</Text>
          <Text>hz</Text>
        </View>
        <View style={styles.text}>
          <Text>{pitch.pitchClass}{pitch.octave}</Text>
        </View>
        <View style={styles.text}>
          {
            pitch.intonation && (
              <>
                <Text>{precision(pitch.intonation)}</Text>
                <Text>cents {pitch.intonationDirection}</Text>
              </>
            )
          }
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
    width: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
