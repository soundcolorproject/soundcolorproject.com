
import { context } from './context.js'
import { getAnalyser } from './analyzer.js'
import { patternsStore } from '../state/patternsStore.js'

export const fftSize = 1024
let analyser
let fftArray
let analyserPromise

export async function getMiniAnalyser() {
  if (!analyserPromise) {
    analyserPromise = (async () => {
      const source = await getAnalyser()

      analyser = context.createAnalyser()
      analyser.fftSize = fftSize
      analyser.smoothingTimeConstant = patternsStore.timeSmoothing

      fftArray = new Float32Array(analyser.frequencyBinCount)

      source.connect(analyser)
      return analyser
    })()
  }
  return analyserPromise
}

export function getMiniFft() {
  if (!analyser) {
    return []
  }

  analyser.getFloatFrequencyData(fftArray)
  return fftArray
}

getMiniAnalyser()
