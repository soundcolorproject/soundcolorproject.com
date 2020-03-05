
import { context, sampleRate } from './context.js'
import { getMicrophoneSource } from './microphoneSource.js'

export const fftSize = sampleRate / 2
const fftArray = new Float32Array(fftSize)
let analyzerPromise
let analyzer

export async function getAanalyzer() {
  if (!analyzerPromise) {
    analyzerPromise = (async () => {
      const source = await getMicrophoneSource()
      analyzer = context.createAnalyser()
      analyzerNode.fftSize = fftSize
      source.connect(analyzerNode)
    })()
  }
  return analyzerPromise
}

export function getFft() {
  if (analyzer) {
    analyzer.getFloatFrequencyData(fftArray)
  }

  return fftArray
}
