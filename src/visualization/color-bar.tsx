import { Pitch } from "@/pitch-processing/tuning/types";
import { StyleSheet, View } from "react-native";
import { GRADIENT, inTuneTolerance } from "./setup";

const VBOX_W = 100;
const VBOX_H = 1028;

export function constructGradientStyle(gradient: {r: number, g: number, b: number, position: number}[]): string {
  const colorList = gradient
    .map(color => {
      const rr = color.r.toString(16).padStart(2, '0')
      const gg = color.g.toString(16).padStart(2, '0')
      const bb = color.b.toString(16).padStart(2, '0')
      return `#${rr}${gg}${bb} ${color.position * 100}%`
    }).join(", ")
  
  return `linear-gradient(180deg, ${colorList})`
}

export function gradientValByPosition(position: number): string {
  const floor = GRADIENT.findLast(value => value.position < position)
  const ceil = GRADIENT.toReversed().findLast(value => value.position > position)

  if (!floor || !ceil) { return "#000000" }

  const ratio = (position - floor.position) / (ceil.position - floor.position)
  const r = Math.round(floor.r + ratio * (ceil.r - floor.r))
  const g = Math.round(floor.g + ratio * (ceil.g - floor.g))
  const b = Math.round(floor.b + ratio * (ceil.b - floor.b))

  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')
  
  return `#${hexR}${hexG}${hexB}`
}

function intonationProportionFromPitch(pitch: Pitch) {
  return (pitch.intonation * (pitch.isFlat ? -1 : 1) + 50) / 100
}

export function gradientValByPitch(pitch: Pitch) {
  return gradientValByPosition(intonationProportionFromPitch(pitch))
}


export function ColorBar(props: { pitch: Pitch }) {
  const scrollThickness = 4
  const scrollYPos = VBOX_H - ( VBOX_H * intonationProportionFromPitch(props.pitch) - scrollThickness / 2)

  const toleranceThickness = 0

  return (
    <View style={styles.colorBar}>
      <svg viewBox={`0 0 ${VBOX_W} ${VBOX_H}`} xmlns="http://www.w3.org/2000/svg">
        <rect
          x={0}
          y={VBOX_H / 2 + VBOX_H * inTuneTolerance - toleranceThickness / 2}
          height={toleranceThickness}
          width={VBOX_W}
          fill="black"
        />
        <rect
          x={0}
          y={VBOX_H / 2 - VBOX_H * inTuneTolerance + toleranceThickness / 2}
          height={toleranceThickness}
          width={VBOX_W}
          fill="black"
        />
        <rect
          x={0}
          y={VBOX_H / 2 - toleranceThickness / 2}
          height={1}
          width={VBOX_W}
          fill="black"
        />

        <rect x={0} y={scrollYPos} width={VBOX_W} height={scrollThickness} fill="white"/>
      </svg>
    </View>
  )
}

const styles = StyleSheet.create({
  colorBar: {
    height: '100%',
    width: '5%',
    backgroundImage: constructGradientStyle(GRADIENT)
  }
})
