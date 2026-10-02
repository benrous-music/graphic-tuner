import { Pitch } from "@/pitch-processing/tuning/types";
import { StyleSheet, View } from "react-native";

const VBOX_W = 100;
const VBOX_H = 1028;


const COLOR_GRADIENT = [
  { r: 0,   g: 0,   b: 255, position: 0.00 },
  { r: 0,   g: 255, b: 255, position: 0.33 },
  { r: 0,   g: 255, b: 0,   position: 0.50 },
  { r: 255, g: 255, b: 0,   position: 0.66 },
  { r: 255, g: 0,   b: 0,   position: 1.00 }
]

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
  const thickness = 7
  const yPos = VBOX_H - ( VBOX_H * intonationProportionFromPitch(props.pitch) - thickness / 2)

  return (
    <View style={styles.colorBar}>
      <svg viewBox={`0 0 ${VBOX_W} ${VBOX_H}`} xmlns="http://www.w3.org/2000/svg">
        <rect x={0} y={yPos} width={VBOX_W} height={10} fill="white"/>
      </svg>
    </View>
  )
}

const styles = StyleSheet.create({
  colorBar: {
    height: '100%',
    width: '5%',
    backgroundImage: 'linear-gradient(180deg, #ff0000 0%, #ffff00 33%, #00ff00 50%, #00ffff 66%, #0000ff 100%)'
  }
})