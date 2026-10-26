import yin from '@/pitch-processing/audiojs-yin';
import { EqualTemperamentIntonation } from '@/pitch-processing/tuning/tune';
import { Pitch } from '@/pitch-processing/tuning/types';
import { useEffect } from 'react';

export function RealtimePitchProcessor(props: {
  pitch: Pitch,
  setPitch: React.Dispatch<React.SetStateAction<Pitch>>,
  intonation: EqualTemperamentIntonation,
}) {
  const setPitch = props.setPitch
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
        }, 30)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (<></>)
}
