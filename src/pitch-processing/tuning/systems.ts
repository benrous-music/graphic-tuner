export interface PitchClass {
  [C: string]: number,
  D:  number,
  Db: number,
  Eb: number,
  E:  number,
  F:  number,
  Gb: number,
  G:  number,
  Ab: number,
  A:  number,
  Bb: number,
  B:  number
}

export function justIntonation(A: number): PitchClass {
  // Ratios from https://en.wikipedia.org/wiki/Five-limit_tuning#/media/File:Five-limit_tuning_ratios_Cuisenaire_diagram.svg
  const C = (3/5) * A

  return {
    C:  C,
    Db: (16/15) * C,
    D:  (9/8) * C,
    Eb: (6/5) * C,
    E:  (5/4) * C,
    F:  (4/3) * C,
    Gb: (45/32) * C,
    G:  (3/2) * C,
    Ab: (8/5) * C,
    A:  (5/3) * C,
    Bb: (9/5) * C,
    B:  (15/8) * C,
  }
}

export function equalTemperament(A: number): PitchClass {
  const C = (1 / Math.pow(2, 9/12)) * A

  return {
    C:  Math.pow(2, 0/12) * C,
    Db: Math.pow(2, 1/12) * C,
    D:  Math.pow(2, 2/12) * C,
    Eb: Math.pow(2, 3/12) * C,
    E:  Math.pow(2, 4/12) * C,
    F:  Math.pow(2, 5/12) * C,
    Gb: Math.pow(2, 6/12) * C,
    G:  Math.pow(2, 7/12) * C,
    Ab: Math.pow(2, 8/12) * C,
    A:  Math.pow(2, 9/12) * C,
    Bb: Math.pow(2, 10/12) * C,
    B:  Math.pow(2, 11/12) * C,
  }
}