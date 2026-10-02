import { StyleSheet, View } from "react-native";
import { ColorBar } from "./color-bar";
import { PitchFrame } from "./pitch-frame";
import { PitchProps } from "./types";

export function Graph(props: PitchProps) {
  return (
    <View style={styles.graph}>
      <ColorBar pitch={props.pitch}/>
      <PitchFrame pitch={props.pitch} setPitch={props.setPitch}/>
    </View>
  )
}

const styles = StyleSheet.create({
  graph: {
    height: '100%',
    width: '95%',
    display: 'flex',
    flexDirection: 'row'
  }
})