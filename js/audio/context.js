
export const sampleRate = 44100
export const context = new AudioContext({
  latencyHint: 'playback',
  sampleRate: sampleRate,
})
