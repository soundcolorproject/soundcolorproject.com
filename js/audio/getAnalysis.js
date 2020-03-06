

import { sampleRate } from './context.js'
import { getFft, fftSize } from './analyzer.js'
import { getNoteInformation } from './getNoteInformation.js'

const maxFrequency = sampleRate / 2
// const MIN_STRENGTH = 0
const MIN_FOR_STATS = -100
const MAX_STRENGTHS = 20
const MAX_TONES = 4

function getStats(fft) {
  const meanStats = fft.reduce((val, curr) => {
    if (curr > MIN_FOR_STATS) {
      val.total += curr
      val.count++
    }
    return val
  }, { total: 0, count: 0 })
  if (meanStats.count === 0) {
    return {
      mean: 0,
      deviation: 0,
    }
  }
  const mean = meanStats.total / meanStats.count

  const varianceStats = fft.reduce((val, curr) => {
    if (curr > MIN_FOR_STATS) {
      val.total += (curr - mean)
      val.count++
    }
    return val
  }, { total: 0, count: 0 })
  const deviation = Math.sqrt(varianceStats.total / varianceStats.count)

  return {
    mean: mean,
    deviation: deviation,
  }
}

function getStrongestValues(fft, minToCount) {
  const strongest = []
  function addIfHigher(value, idx) {
    if (value < minToCount) {
      return
    }
    const obj = {
      value: value,
      idx: idx,
    }
    if (strongest.length === 0) {
      strongest.push(obj)
      return
    } else {
      let insertionIndex = -1
      for (let i = 0; i < strongest.length; i++) {
        if (value > strongest[i].value) {
          insertionIndex = i
          break
        }
      }
      if (insertionIndex === -1 && strongest.length < MAX_STRENGTHS) {
        strongest.push(obj)
      } else if (insertionIndex >= 0) {
        strongest.splice(insertionIndex, 0, obj)
        if (strongest.length > MAX_STRENGTHS) {
          strongest.splice(MAX_STRENGTHS, 1)
        }
      }
    }
  }
  

  fft.forEach(addIfHigher)

  return strongest
}

function getTones(strengths) {
  let tones = strengths.map(({ value, idx }) => {
    const frequency = idx * (sampleRate / 2) / fftSize

    return {
      dB: value,
      frequency: frequency,
      note: getNoteInformation(frequency)
    }
  })

  tones = tones.filter(({ value, frequency, note: { note } }, ownIdx) => (
    !tones.slice(0, ownIdx).some((data) => (
      data.note.note === note
    ))
  ))

  return tones.slice(0, MAX_TONES)
}

export function getAnalysis() {
  const fft = getFft()
  const { mean, deviation } = getStats(fft)
  const noise = (mean + MIN_FOR_STATS) / -MIN_FOR_STATS
  const tones = getTones(getStrongestValues(fft, mean + deviation))

  return {
    noise: noise,
    tones: tones,
  }
}
