import { Pitch } from "@/pitch-processing/tuning/types";
import { StyleSheet, Text, View } from "react-native";

function precision(n: number, decimalPlaces: number): number {
  return Math.round(n * (10 ** decimalPlaces)) / (10 ** decimalPlaces)
}

export function PitchReadout(props: { pitch: Pitch }) {
  const isReading = props.pitch.frequency !== -1
  
  let frequency = precision(props.pitch.frequency, 1)
  if (`${frequency}`.indexOf('.') > 3) {
    frequency = precision(props.pitch.frequency, 0)
  }
  
  return isReading && (
    <>
      <View style={styles.pitchDisplay}>
        <Text>
          {props.pitch.pitchClass}
          {props.pitch.octave}
        </Text>
        <View style={{ width: '45%', justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text>{props.pitch.isFlat && '-'}{props.pitch.isSharp && '+'}</Text>
          <Text>{precision(props.pitch.intonation, 0)}</Text>
        </View>
      </View>
      <View style={styles.frequencyDisplay}>
        <Text>{frequency}</Text>
        <Text>hz</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  pitchDisplay: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6
  },
  frequencyDisplay: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6
  }
})