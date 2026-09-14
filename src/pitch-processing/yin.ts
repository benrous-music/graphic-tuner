export function yinDetector(buffer: any, sampleRate: number, threshold = 0.1) {
  const n = buffer.length;
  const halfN = Math.floor(n / 2);
  const yinBuffer = new Array(halfN).fill(0);

  let runningSum = 0;
  for (let tau = 0; tau < halfN; tau++) {
    for (let i = 0; i < halfN; i++) {
      const delta = buffer[i] - buffer[i + tau];
      yinBuffer[tau] += delta * delta;
    }
    runningSum += yinBuffer[tau];
    yinBuffer[tau] *= tau / runningSum;
  }

  for (let tau = 2; tau < halfN; tau++) {
    if (yinBuffer[tau] < threshold) {
      let refinedTau = tau;
      for (let i = tau + 1; i < halfN; i++) {
        if (yinBuffer[i] < yinBuffer[refinedTau]) {
          refinedTau = i;
        }
      }
      if (refinedTau !== tau) {
        return sampleRate / parabolicInterpolation(yinBuffer, refinedTau);
      } else {
        return sampleRate / tau;
      }
    }
  }
  return 0;
}

function parabolicInterpolation(yinBuffer: any, tau: number) {
  const x1 = tau - 1;
  const x2 = tau;
  const x3 = tau + 1;

  if (x1 < 0 || x3 >= yinBuffer.length) return tau;
  
  const y1 = yinBuffer[x1];
  const y2 = yinBuffer[x2];
  const y3 = yinBuffer[x3];
  
  const a = (y1 - 2 * y2 + y3) / 2;
  const b = (y3 - y1) / 2;
  
  return x2 - b / (2 * a);
}
