import { Pitch } from "@/pitch-processing/tuning/types";
import { Text, View } from "react-native";

function precision(n: number, decimalPlaces: number): number {
  return Math.round(n * (10 ** decimalPlaces)) / (10 ** decimalPlaces)
}

export function PitchReadout(props: { pitch: Pitch }) {
  let frequency = precision(props.pitch.frequency, 1)
  if (`${frequency}`.indexOf('.') > 3) {
    frequency = precision(props.pitch.frequency, 0)
  }
  
  return (
    <>
      <View style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: props.pitch.frequency === -1 ? 0 : 100,
        padding: 6
      }}>
        <Text style={{
          fontWeight: "bold",
          fontSize: 18,
          width: "100%",
          textAlign: "center"
        }}>
          {props.pitch.pitchClass}
          {props.pitch.octave}
        </Text>

        <View style={{
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}>
          <Text>
            {frequency}
          </Text>
          <Text>
            {props.pitch.isFlat && "–"}{props.pitch.isSharp && "+"}
            {precision(props.pitch.intonation, 0)}&cent;
          </Text>
        </View>
      </View>
    </>
  )
}
