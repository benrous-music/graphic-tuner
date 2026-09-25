import { intonation } from "@/app/App";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PitchProps } from "./types";

const VBOX_W = 500;
const VBOX_H = 270;

const MIN_FREQ = 90;
const MAX_FREQ = 2000;

const READING_INCREMENT = 1;

export function PitchFrame(props: PitchProps) {
  const REFERENCE_FREQ = intonation.A;
  const CENTS_MIN = intonation.intervalToCents(REFERENCE_FREQ, MIN_FREQ)
  const CENTS_MAX = intonation.intervalToCents(REFERENCE_FREQ, MAX_FREQ)
  
  const [scrollBarX, setScrollBarX] = useState<number>(0)
  const [yValues, setYValues] = useState<number[]>([])
  const [path, setPath] = useState<string>("")



  const calculateYFromCents = (cents: number) => {
    const yValue = ((cents - CENTS_MIN) / (CENTS_MAX - CENTS_MIN)) * (-1 * VBOX_H) + VBOX_H
    return Number.isNaN(yValue) ? -1 : yValue
  }
  const calculateYFromFreq = (freq: number) => {
    const cents = intonation.intervalToCents(REFERENCE_FREQ, freq)
    return calculateYFromCents(cents)
  }
  const pitchPointY = calculateYFromFreq(props.pitch.frequency)



  const getPointsFromYValues = () => {
    const points = yValues
      .map((value, ix) => {
        return `${
          (value === -1 || yValues.at(ix - 1) === -1)
           ?
          'M ': ''
        }${READING_INCREMENT * ix} ${value}`
      })
      .join(' ')
    
    return `${points.charAt(0) === 'M' ? '' : 'M '}${points}`
  }
  

  useEffect(() => {
    setScrollBarX(scrollBarX + READING_INCREMENT)

    yValues.push(!Number.isNaN(pitchPointY) ? pitchPointY : -1)
    setYValues(yValues)

    setPath(getPointsFromYValues())
  }, [props.pitch.frequency])



  return (
    <View style={styles.container}>
      <svg viewBox={`0 0 ${VBOX_W} ${VBOX_H}`} xmlns="http://www.w3.org/2000/svg">

      
        {
          Array(Math.ceil((2400 - -2400) / 1200))
            .fill(-2400)
            .map((x, y) => x + y * 1200)
            .map((cents, ix) => {
              return (
                <rect key={ix} x={0} y={calculateYFromCents(cents) - 0.1} width={VBOX_W} height={0.2}/>
              )
            })
        }


        <rect x={0} y={calculateYFromCents(2400) - 0.2} width={VBOX_W} height={0.4}/>
        <rect x={0} y={calculateYFromCents(1200) - 0.2} width={VBOX_W} height={0.4}/>
        <rect x={0} y={calculateYFromCents(0) - 0.2} width={VBOX_W} height={0.4}/>
        <rect x={0} y={calculateYFromCents(-1200) - 0.2} width={VBOX_W} height={0.4}/>
        <rect x={0} y={calculateYFromCents(-2400) - 0.2} width={VBOX_W} height={0.4}/>

        <path d={path} stroke="black" strokeWidth={0.5} fill="none"/>
        <rect x={scrollBarX} y={VBOX_H - 5} width={0.5} height={5}/>
        {
          pitchPointY > 0 && (<circle r={1} cx={scrollBarX} cy={pitchPointY} />)
        }
      </svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '95%',
    borderColor: '#000',
    borderWidth: 2,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
})