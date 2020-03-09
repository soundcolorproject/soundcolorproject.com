

import { sampleRate } from './context.js'
import { getFft, fftSize } from './analyzer.js'
import { getNoteInformation } from './getNoteInformation.js'

export const MIN_FOR_STATS = -100
const MAX_TONES = 3
const MAX_STRENGTHS = MAX_TONES * 3

function getStats(fft) {
  const volumes = fft.map(dBtoVolume)
  const meanStats = volumes.reduce((val, curr, idx) => {
    if (curr > MIN_FOR_STATS) {
      val.total += curr
      val.count += 1
    }
    return val
  }, { total: 0, count: 0 })
  if (meanStats.count === 0) {
    return {
      dB: {
        mean: -100,
        deviation: 0,
      },
      volume: {
        mean: 1 / 1024,
        deviation: 0,
      },
      counted: 0,
    }
  }
  const mean = meanStats.total / meanStats.count

  const varianceStats = volumes.reduce((val, curr, idx) => {
    if (curr > MIN_FOR_STATS) {
      val.total += (curr - mean) ** 2
      val.count += 1
    }
    return val
  }, { total: 0, count: 0 })
  const deviation = Math.sqrt(varianceStats.total / varianceStats.count)

  const meandB = volumeTodB(mean)
  const deviationdB = Math.abs(volumeTodB(mean + deviation) - meandB)

  return {
    dB: {
      mean: meandB,
      deviation: deviationdB,
    },
    volume: {
      mean: mean,
      deviation: deviation,
    },
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
        const volume = dBtoVolume(data.dB) + dBtoVolume(dB)
        data.dB = Math.log2(volume) * 10
        return true
      } else {
        return false
      }
    })
  ))

  return tones.slice(0, MAX_TONES)
}

export function dBtoVolume(dB) {
  return 2 ** (dB / 10)
}

export function volumeTodB(volume) {
  if (volume <= 0) {
    console.log('wat', volume)
    return 0
  }
  return Math.log2(volume) * 10
}

const SIGMA_MULT = 5
export function getAnalysis() {
  const fft = getFft() // .map(value => value - MIN_FOR_STATS)
  const stats = getStats(fft)
  const strongest = getStrongestValues(fft, volumeTodB(stats.volume.mean + stats.volume.deviation * SIGMA_MULT))
  const tones = getTones(strongest)
  const tonalVolume = tones.reduce((total, { dB }) => total + dBtoVolume(dB), 0)
  const noiseVolume = stats.volume.mean - (tonalVolume / stats.counted)
  const noise = volumeTodB(noiseVolume)

  return {
    noise: noise,
    tones: tones,
  }
}
