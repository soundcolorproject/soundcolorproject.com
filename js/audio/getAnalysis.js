

import { sampleRate } from './context.js'
import { getFft, fftSize } from './analyzer.js'
import { getNoteInformation } from './getNoteInformation.js'

export const MIN_FOR_STATS = -100
const MAX_TONES = 3
const MAX_STRENGTHS = MAX_TONES * 3

function getStats(fft) {
  const meanStats = fft.reduce((val, curr, idx) => {
    if (curr > 0) {
      val.total += curr
      val.count += 1
    }
    return val
  }, { total: 0, count: 0 })
  if (meanStats.count === 0) {
    return {
      mean: 0,
      deviation: 0,
      counted: 0,
    }
  }
  const mean = meanStats.total / meanStats.count

  const varianceStats = fft.reduce((val, curr, idx) => {
    if (curr > 0) {
      val.total += curr * curr
      val.count += 1
    }
    return val
  }, { total: 0, count: 0 })
  const deviation = Math.sqrt(varianceStats.total / varianceStats.count)

  return {
    mean: mean,
    deviation: deviation,
    counted: meanStats.count,
  }
}

function getStrongestValues(fft, minToCount) {
  const strongest = []
  function addIfHigher(value, idx) {
    if (value < minToCount || idx === 0) {
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
    const frequency = idx * (sampleRate) / fftSize

    return {
      dB: value,
      frequency: frequency,
      harmonics: 1,
      note: getNoteInformation(frequency)
    }
  })

  tones = tones.filter(({ dB, note: { note } }, ownIdx) => (
    !tones.slice(0, ownIdx).some((data) => {
      if (data.note.note === note) {
        data.harmonics++
        data.dB += (dB / (data.harmonics ** 3))
        return true
      } else {
        return false
      }
    })
  ))

  return tones.slice(0, MAX_TONES)
}

export function getAnalysis() {
  const fft = getFft().map(value => value - MIN_FOR_STATS)
  const { mean, deviation, counted } = getStats(fft)
  const strongest = getStrongestValues(fft, mean + deviation)
  const tonalValues = strongest.reduce((total, { value }) => total + value, 0) / counted
  const noise = mean - tonalValues
  const tones = getTones(strongest)

  return {
    noise: noise,
    tones: tones,
  }
}
