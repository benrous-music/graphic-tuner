import { Pitch } from "@/pitch-processing/tuning/types";
import { StyleSheet, View } from "react-native";

const VBOX_W = 100;
const VBOX_H = 1028;

const COLOR_GRADIENT = [
  { r: 128, g: 56,  b: 131, position: 0.00 },
  { r: 255, g: 47,  b: 47,  position: 0.10 },
  { r: 255, g: 217, b: 0,   position: 0.35 },
  { r: 255, g: 255, b: 0,   position: 0.43 }, // position = 0.5 - sensitivity
  { r: 208, g: 255, b: 0,   position: 0.45 }, // position = 0.5 - sensitivity + interval
  { r: 0,   g: 255, b: 47,  position: 0.50 },
  { r: 43,  g: 231, b: 231, position: 0.55 },
  { r: 128, g: 56,  b: 131, position: 1.00 }
]

function constructGradientStyle(gradient: {r: number, g: number, b: number, position: number}[]): string {
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
  const floor = COLOR_GRADIENT.findLast(value => value.position < position)
  const ceil = COLOR_GRADIENT.toReversed().findLast(value => value.position > position)

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
  const thickness = 4
  const yPos = VBOX_H - ( VBOX_H * intonationProportionFromPitch(props.pitch) - thickness / 2)

  return (
    <View style={styles.colorBar}>
      <svg viewBox={`0 0 ${VBOX_W} ${VBOX_H}`} xmlns="http://www.w3.org/2000/svg">
        <rect x={0} y={yPos} width={VBOX_W} height={10} fill="white"/>
      </svg>
    </View>
  )
}

const sensitivity = 7
const interval = sensitivity / 2

// TODO: make sensitivity dictate position of the stop between green and yellow
// TODO: dynamically change boundary between green and teal

const styles = StyleSheet.create({
  colorBar: {
    height: '100%',
    width: '5%',
    backgroundImage: constructGradientStyle(COLOR_GRADIENT)
  }
})