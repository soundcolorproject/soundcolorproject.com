
import { context, resumePromise } from './context.js'
import { getMicrophoneSource } from './microphoneSource.js'

export const fftSize = 32768 // maximum size allowed
let analyser
let fftArray
let analyserPromise

export async function getAnalyser() {
  if (!analyserPromise) {
    analyserPromise = (async () => {
      const source = await getMicrophoneSource()
      await resumePromise

      analyser = context.createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = 0.9

      fftArray = new Float32Array(analyser.frequencyBinCount)

      source.connect(analyser)
      return analyser
    })()
  }
  return analyserPromise
}

export function getFft() {
  if (!analyser) {
    return []
  }

  analyser.getFloatFrequencyData(fftArray)
  return fftArray
}

getAnalyser()
