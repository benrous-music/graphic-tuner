import { equalTemperament, PitchClass } from "./systems"

/**
 * Given two frequency values, calculate the number of cents that make up the interval between them
 * @param {number} lowerFreq the first frequency value of the interval
 * @param {number} higherFreq the second frequency value of the interval
 * 
 * @return {number} the number of cents between `freq1` and `freq2`
 */
function freqIntervalToCents(lowerFreq: number, higherFreq: number): number {
  const ratio = higherFreq / lowerFreq
  return 1200 * Math.log2(ratio)
}

class Intonation {
  pitchClass: PitchClass
  A4: number

  constructor(A4: number) {
    this.pitchClass = equalTemperament(A4)
    this.A4 = A4 // e.g. 440
  }

  _absoluteIntonation(freq: number) { return freqIntervalToCents(this.pitchClass.C, freq) }

  calculateNoteName(freq: number) {
    // uses 1150c as octave cutoff because ±50c is the same pitch class as 0c
    const OCTAVE_CUTOFF = 1150 // in cents

    let f = freq
    let octave = 4 // default octave for A4

    // normalize to within an octave, and adjust octave label
    if (this._absoluteIntonation(freq) > 0) {
      while (this._absoluteIntonation(f) > OCTAVE_CUTOFF) {
        f = f / 2
        octave += 1
      }
    } else {
      while (this._absoluteIntonation(f) < -1 * OCTAVE_CUTOFF) {
        f = f / 2
        octave -= 1
      }
    }

    let cents = this._absoluteIntonation(f)
    let semitonesAway = Math.floor((cents + 50) / 100)

    if (semitonesAway >= 0) {
      return Object.keys(this.pitchClass).at(semitonesAway)
    }
    return Object.keys(this.pitchClass).at(11 + semitonesAway)
  }

  calculateIntonation(freq: number) {
    let absoluteIntonation = Math.abs(this._absoluteIntonation(freq))
    
    let nearestHundredth = Math.floor(absoluteIntonation / 100) * 100
    let centsWithinSemitone = absoluteIntonation % nearestHundredth

    if (centsWithinSemitone > 50) {
      return -1 * centsWithinSemitone + 50
    } else if (centsWithinSemitone < -50) {
      return -1 * centsWithinSemitone - 50
    }
    return centsWithinSemitone
  }

}
