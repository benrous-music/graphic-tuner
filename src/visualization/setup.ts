export const inTuneTolerance = 0.08

export const GRADIENT = [
  { r: 128, g: 56,  b: 131, position: 0.00 },
  { r: 255, g: 47,  b: 47,  position: 0.10 },
  { r: 242, g: 255, b: 0,   position: 0.50 - 1.2 * inTuneTolerance },
  { r: 0,   g: 255, b: 47,  position: 0.50 },
  { r: 0,   g: 255, b: 242, position: 0.50 + 1.2 * inTuneTolerance },
  { r: 128, g: 56,  b: 131, position: 1.00 }
]

// export const GRADIENT = [
//   { r: 128, g: 56,  b: 131, position: 0.00 },
//   { r: 255, g: 47,  b: 47,  position: 0.10 },
//   { r: 255, g: 217, b: 0,   position: 0.35 },
//   { r: 255, g: 255, b: 0,   position: 0.43 },
//   { r: 208, g: 255, b: 0,   position: 0.45 },
//   { r: 0,   g: 255, b: 47,  position: 0.50 },
//   { r: 43,  g: 231, b: 231, position: 0.55 },
//   { r: 128, g: 56,  b: 131, position: 1.00 }
// ]