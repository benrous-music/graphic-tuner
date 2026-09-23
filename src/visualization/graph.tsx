import { StyleSheet, View } from "react-native";
import { PitchFrame } from "./pitch-frame";
import { PitchProps } from "./types";

export function Graph(props: PitchProps) {
  return (
    <View style={styles.graph}>
      <PitchFrame pitch={props.pitch} setPitch={props.setPitch}/>
    </View>
  )
}

const styles = StyleSheet.create({
  graph: {
    height: '100%',
    width: '95%',
    display: 'flex'
  }
})