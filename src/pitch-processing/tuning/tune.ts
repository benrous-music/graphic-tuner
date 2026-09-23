import { Pitch } from "./types"

export class EqualTemperamentIntonation {
  PITCH_CLASS_MIN: number = -50
  PITCH_CLASS_MAX: number = 49.999
  OCTAVE: number = 1200
  OCTAVE_MIN: number = this.PITCH_CLASS_MIN
  OCTAVE_MAX: number = 1100 + this.PITCH_CLASS_MAX
  A: number

  PITCHES: string[] = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]

  constructor(A?: number) { this.A = A ?? 440 }

  intervalToCents(f1: number, f2: number): number { return 1200 * Math.log2(f2 / f1) }

  calculateIntonation(f: number): Pitch {
    if (f === -1) {
      return {
        frequency: f,
        pitchClass: "",
        octave: -1,
        intonation: -51,
        intonationDirection: ""
      }
    }

    let cents = this.intervalToCents(this.A, f)
    let octaveLabel = 4

    while (cents > this.OCTAVE_MAX) {
      cents -= this.OCTAVE
      octaveLabel += 1
    }

    while (cents < this.OCTAVE_MIN) {
      cents += this.OCTAVE
      octaveLabel -= 1
    }

    // `cents` is now guaranteed to be on the interval [OCTAVE_MIN, OCTAVE_MAX]
    
    // index into `this.PITCHES` array
    const pitchIndex = Math.round(cents / 100)
    // cents sharp or flat: negative => flat; positive => sharp
    const intonation = cents % 100 > this.PITCH_CLASS_MAX ? -1 * (100 - cents % 100) : cents % 100
    
    let intonationDirection = ""
    if (intonation < 0) { intonationDirection = "flat"}
    else if (intonation > 0) { intonationDirection = "sharp"}

    return {
      frequency: f,
      pitchClass: this.PITCHES[pitchIndex],
      octave: octaveLabel,
      intonation: Math.abs(intonation),
      intonationDirection: intonationDirection
    }
  }
}







