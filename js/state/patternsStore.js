
import { observable, reaction } from 'https://unpkg.com/mobx@5.x?module'
import { hexToHsv } from '../color/colorHelpers.js'
import { getAnalyser } from '../audio/analyzer.js'
import { getMiniAnalyser } from '../audio/miniAnalyser.js'

const defaultCustomColors = {
  'C': hexToHsv('#E2CF0B'),
  'C#': hexToHsv('#FFE50C'),
  'D': hexToHsv('#35C80B'),
  'D#': hexToHsv('#0B33A5'),
  'E': hexToHsv('#19BDA2'),
  'F': hexToHsv('#835BD9'),
  'F#': hexToHsv('#774ACB'),
  'G': hexToHsv('#E4C5DD'),
  'G#': hexToHsv('#E0BFD7'),
  'A': hexToHsv('#A30008'),
  'A#': hexToHsv('#9B1A6F'),
  'B': hexToHsv('#BA000A'),
}

function getCustomColorValue (name, note) {
  const storageVal = localStorage.getItem(`custom:${name}:${note}`)
  if (storageVal) {
    return JSON.parse(storageVal)
  } else {
    return defaultCustomColors[note]
  }
}

function saveCustommColorValue (name, note, value) {
  localStorage.setItem(`custom:${name}:${note}`, JSON.stringify(value))
}

function getCustomColors(name = 'current') {
  const colors = observable(Object.keys(defaultCustomColors).reduce((full, note) => ({
    ...full,
    [note]: getCustomColorValue(name, note),
  }), {}))
  const disposers = []
  Object.keys(defaultCustomColors).forEach(note => (
    disposers.push(reaction(
      () => colors[note],
      (value) => saveCustommColorValue(name, note, value),
    ))
  ))
  colors.clearReactions = () => disposers.forEach(d => d())
  colors.reset = () => {
    Object.keys(defaultCustomColors).forEach(note => {
      colors[note] = defaultCustomColors[note]
    })
  }
  return colors
}

export const patternsStore = observable({
  transitionSpeed: 0.9,
  noiseMultiplier: 1,
  vibranceMultiplier: 2.5,
  toneSigma: 0,
  timeSmoothing: 0.8,
  currentPattern: '',
  patternData: {
    chakras: {
      label: 'Chakras',
      colors: {
        'C': hexToHsv('#EC472D'),
        'C#': hexToHsv('#EC5F2D'),
        'D': hexToHsv('#EC972D'),
        'D#': hexToHsv('#F6AB0B'),
        'E': hexToHsv('#F6D70B'),
        'F': hexToHsv('#40C070'),
        'F#': hexToHsv('#40C0AD'),
        'G': hexToHsv('#0080FF'),
        'G#': hexToHsv('#1369EB'),
        'A': hexToHsv('#204ADA'),
        'A#': hexToHsv('#5C22ED'),
        'B': hexToHsv('#9D32F5'),
      },
    },
    chromesthesia: {
      label: 'Chromesthesia',
      colors: {
        'C': hexToHsv('#B2B9CD'),
        'C#': hexToHsv('#8D3B4C'),
        'D': hexToHsv('#E1BF5C'),
        'D#': hexToHsv('#BA64E1'),
        'E': hexToHsv('#3793B4'),
        'F': hexToHsv('#A0A883'),
        'F#': hexToHsv('#69B777'),
        'G': hexToHsv('#F56A4E'),
        'G#': hexToHsv('#8B2F64'),
        'A': hexToHsv('#EC9F40'),
        'A#': hexToHsv('#D3BD8D'),
        'B': hexToHsv('#D3BED9'),
      },
    },
    emotion: {
      label: 'Emotion',
      colors: {
        'C': hexToHsv('#0E74D9'),
        'C#': hexToHsv('#4BB0FF'),
        'D': hexToHsv('#C80006'),
        'D#': hexToHsv('#0F7102'),
        'E': hexToHsv('#17AA05'),
        'F': hexToHsv('#FD6809'),
        'F#': hexToHsv('#3F31FF'),
        'G': hexToHsv('#0000BD'),
        'G#': hexToHsv('#FC0007'),
        'A': hexToHsv('#FFE744'),
        'A#': hexToHsv('#FFFF43'),
        'B': hexToHsv('#D400D6'),
      },
    },
    chromotherapy: {
      label: 'Chromotherapy',
      colors: {
        'C': hexToHsv('#46680e'),
        'C#': hexToHsv('#4a996b'),
        'D': hexToHsv('#23778f'),
        'D#': hexToHsv('#2c3358'),
        'E': hexToHsv('#e37081'),
        'F': hexToHsv('#934682'),
        'F#': hexToHsv('#40C0AD'),
        'G': hexToHsv('#fc5719'),
        'G#': hexToHsv('#a43a11'),
        'A': hexToHsv('#fd7d0f'),
        'A#': hexToHsv('#fd9f18'),
        'B': hexToHsv('#fdb217'),
      },
    },
    adolescence: {
      label: 'Adolescence',
      colors: {
        'C': hexToHsv('#E2CF0B'),
        'C#': hexToHsv('#FFE50C'),
        'D': hexToHsv('#35C80B'),
        'D#': hexToHsv('#0B33A5'),
        'E': hexToHsv('#19BDA2'),
        'F': hexToHsv('#835BD9'),
        'F#': hexToHsv('#774ACB'),
        'G': hexToHsv('#E4C5DD'),
        'G#': hexToHsv('#E0BFD7'),
        'A': hexToHsv('#A30008'),
        'A#': hexToHsv('#9B1A6F'),
        'B': hexToHsv('#BA000A'),
      },
    },
    custom: {
      label: 'Custom',
      colors: getCustomColors(),
    }
  },
  notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
})

reaction(
  () => patternsStore.timeSmoothing,
  async (smoothing) => {
    const analysers = await Promise.all([getAnalyser(), getMiniAnalyser()])
    analysers.forEach(analyser => analyser.smoothingTimeConstant = smoothing)
  }
)
