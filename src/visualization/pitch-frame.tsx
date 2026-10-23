import { intonation } from "@/app/App";
import { useEffect, useState } from "react";
import config from "../config.json";
import * as math from "./math";
import { GRADIENT } from "./setup";
import { PitchProps } from "./types";

const VBOX_W = 500;

const DEFAULT_FREQ_FLOOR = config.visualizer.defaultFrequencyRange[0];
const DEFAULT_FREQ_CEIL = config.visualizer.defaultFrequencyRange[1];
const HARD_FREQ_FLOOR = config.visualizer.limitedRrequencyRange[0];
const HARD_FREQ_CEIL = config.visualizer.limitedRrequencyRange[1];


const READING_INCREMENT = 1;
const CENTS_INCREMENT = 100;
const WINDOW_HEIGHT_PADDING = config.visualizer.centsAroundPitchExtrema;

export function PitchFrame(props: PitchProps) {
  const VBOX_H = VBOX_W * window.innerHeight / window.innerWidth

  const REFERENCE_FREQ = intonation.A
  const [centsFloor, setCentsFloor] = useState<number>(intonation.intervalToCents(REFERENCE_FREQ, DEFAULT_FREQ_FLOOR))
  const [centsCeil, setCentsCeil] = useState<number>(intonation.intervalToCents(REFERENCE_FREQ, DEFAULT_FREQ_CEIL))


  const recalculateWindowHeight = (newPitch: number) => {
    if (newPitch > HARD_FREQ_CEIL || newPitch < HARD_FREQ_FLOOR) { return }

    const newCents = intonation.intervalToCents(REFERENCE_FREQ, newPitch)

    if (newCents < centsFloor) { setCentsFloor(newCents - WINDOW_HEIGHT_PADDING) }
    if (newCents > centsCeil) { setCentsCeil(newCents + WINDOW_HEIGHT_PADDING) }
  }
  const resetWindowHeight = () => {
    setCentsFloor(intonation.intervalToCents(REFERENCE_FREQ, DEFAULT_FREQ_FLOOR))
    setCentsCeil(intonation.intervalToCents(REFERENCE_FREQ, DEFAULT_FREQ_CEIL))
  }


  const [scrollBarX, setScrollBarX] = useState<number>(0)
  const [pitches, setPitches] = useState<number[]>([])
  const [path, setPath] = useState<string>("")


  const calculateYFromCents = (cents: number) => {
    const yValue = ((cents - centsFloor) / (centsCeil - centsFloor)) * (-1 * VBOX_H) + VBOX_H
    return Number.isNaN(yValue) ? -1 : yValue
  }
  const calculateYFromFreq = (freq: number) => {
    const cents = intonation.intervalToCents(REFERENCE_FREQ, freq)
    return calculateYFromCents(cents)
  }
  const pitchPointY = calculateYFromFreq(props.pitch.frequency)



  const getPointsFromYValues = (yValues: number[]) => {
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

  const getPointsFromPitches = () => {
    const yVals = pitches.map(pitch => calculateYFromFreq(pitch))
    return getPointsFromYValues(yVals)
  }
  

  useEffect(() => {
    if (scrollBarX > VBOX_W) {
      setScrollBarX(0)
      setPitches([])
      resetWindowHeight()
    } else {
      setScrollBarX(scrollBarX + READING_INCREMENT)
      pitches.push(props.pitch.frequency)
      setPitches(pitches)
      recalculateWindowHeight(props.pitch.frequency)
    }
    
    setPath(getPointsFromPitches())
  }, [props.pitch.frequency])



  return (
    <svg viewBox={`0 0 ${VBOX_W} ${VBOX_H}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="GradientWindow" gradientTransform="rotate(90)">
          {
            GRADIENT.map((stop, ix) => (
              <stop
                key={ix}
                offset={`${stop.position*100}%`}
                stopColor={`rgb(${stop.r}, ${stop.g}, ${stop.b})`}
              />
            ))
          }
        </linearGradient>
      </defs>

      {
        math.range(-2000 + CENTS_INCREMENT / 2, 4000 - CENTS_INCREMENT / 2, CENTS_INCREMENT)
        .map((cents, ix) => {
          const gradientWindowHeight = calculateYFromCents(0) - calculateYFromCents(CENTS_INCREMENT)
          
          return (
            <rect
              key={ix}
              x={0}
              y={calculateYFromCents(cents)}
              width={VBOX_W}
              height={gradientWindowHeight}
              fill="url(#GradientWindow)"
            />
          )
        })
      }

      <g style={{ mixBlendMode: "screen" }}>
        <rect x={0} y={0} width={VBOX_W} height={VBOX_H} fill="white"/>
        <path d={path} stroke="black" strokeWidth={1} fill="none"/>
        {
          pitchPointY > 0 && (
            <circle r={1} cx={scrollBarX} cy={pitchPointY} fill="black"/> // fill={gradientValByPitch(props.pitch)}
          )
        }
      </g>


      {
        math.range(-3000, 4000, CENTS_INCREMENT)
          .map((cents, ix) => (
            <rect key={ix} x={0} y={calculateYFromCents(cents) - 0.1} width={VBOX_W} height={0.2}/>
          ))
      }

      <rect x={scrollBarX} y={VBOX_H - 5} width={0.5} height={5}/>

      <rect
        x={0} y={0}
        width={VBOX_W} height={VBOX_H}
        fill="#00000000"
        stroke="#000"
        strokeWidth={3}
      />
    </svg>
  )
}
