import { StyleSheet, View } from "react-native";
import config from "../config.json";
import { ColorBar, constructGradientStyle } from "./color-bar";
import { PitchFrame } from "./pitch-frame";
import { PitchReadout } from "./pitch-readout";
import { GRADIENT } from "./setup";
import { PitchProps } from "./types";

export function Graph(props: PitchProps) {

  return (
    <View style={styles.graph}>
      <View style={styles.pitchSideBar}>
        <View style={styles.readout}>
          <PitchReadout pitch={props.pitch}/>
        </View>
        <View style={styles.colorBar}>
          <ColorBar pitch={props.pitch}/>
        </View>
      </View>
      <View style={styles.pitchFrame}>
        <PitchFrame pitch={props.pitch} setPitch={props.setPitch}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pitchSideBar: {
    // styles for the side bar containing both the color bar
    // and the numerical pitch/intonation readout
    width: '5%',
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
  },
  readout: {
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  colorBar: {
    // height: `${config.visualizer.domHeightPct}%`,
    height: '76.5%',
    backgroundImage: constructGradientStyle(GRADIENT),
    borderRadius: 8
  },
  pitchFrame: {
    height: `${config.visualizer.domHeightPct}%`,
    width: '95%',
    borderColor: '#000',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  graph: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    // height: '100%',
    width: '95%',
    margin: '2.5%'
  },
})