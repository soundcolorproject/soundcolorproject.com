
import { context } from './context.js'
import { getAnalyser } from './analyzer.js'
import { patternsStore } from '../state/patternsStore.js'

export const fftSize = 1024
let prevSource
let analyser
let fftArray
let analyserPromise

export async function getMiniAnalyser() {
  if (!analyserPromise) {
    analyserPromise = (async () => {
      const source = prevSource || await getAnalyser()
      prevSource = source

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

export function setSource(newSource) {
  if (prevSource && analyser) {
    prevSource.disconnect(analyser)
  }
  if (analyser) {
    newSource.connect(analyser)
  }
  
  prevSource = newSource
}

export function getMiniFft() {
  if (!analyser) {
    return []
  }

  analyser.getFloatFrequencyData(fftArray)
  return fftArray
}

getMiniAnalyser()
