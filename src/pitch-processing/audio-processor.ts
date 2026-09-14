import { yinDetector } from "./yin"

export default class AudioProcessor {
  audioContext: any
  analyser: any
  microphone: any
  pitchDetector: any
  isRunning: any
  animationId: any
  lastFrequency: any
  lastNote: any
  onNoteDetected: any

  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.pitchDetector = null;
    this.isRunning = false;
    this.animationId = null;
    this.lastFrequency = 0; // Keep previous frequency
    this.lastNote = '--';
    this.onNoteDetected = () => {}; // Callback function
  }

  async start() {
    try {
      this.audioContext = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.microphone.connect(this.analyser);

      this.pitchDetector = yinDetector;

      this.isRunning = true;
      this.animate();

    } catch (error: any) {
      console.error('Microphone access failed:', error);
      let message = 'Microphone access denied or not supported.';
      if (error.name === 'NotAllowedError') {
        message = 'Microphone permission denied. Please allow access.';
      } else if (error.name === 'NotFoundError') {
        message = 'Microphone not found. Check your microphone.';
      } else if (error.name === 'NotReadableError') {
        message = 'Microphone is being used by another application.';
      }
      alert(message);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.microphone) {
      this.microphone.disconnect();
    }
  }

  animate() {
    if (!this.isRunning) return;

    const n = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(n);
    this.analyser.getFloatTimeDomainData(dataArray);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / n);
    const volume = rms * 100; // Percentage

    let frequency = 0;
    let note = '--';

    // Analyze if volume is sufficient
    if (volume > 1) { // Threshold, adjustable
      frequency = this.pitchDetector(dataArray, this.audioContext.sampleRate);
      if (frequency && frequency > 0) {
        note = this.frequencyToNote(frequency);
        this.lastFrequency = frequency; // Update
        this.lastNote = note;
      } else {
        frequency = this.lastFrequency; // Use previous
        note = this.lastNote;
      }
    }

    // Update elements
    this.onNoteDetected(frequency, note);
    this.animationId = requestAnimationFrame(() => {
      setTimeout(() => {
        this.animate()
      }, 50)
    });
  }

  frequencyToNote(frequency: number) {
    const A4 = 440;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Calculate MIDI note number
    const midiNote = Math.round(12 * Math.log2(frequency / A4)) + 69;

    // Octave and note name
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;

    return noteNames[noteIndex] + octave;
  }
}
