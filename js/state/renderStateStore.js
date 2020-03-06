
import { observable, action } from 'https://unpkg.com/mobx@5.x?module'
import { resume } from '../audio/context.js'

import { patternsStore } from './patternsStore.js'

export const renderStateStore = observable({
  showText: true,
  showColors: false,
})

document.addEventListener('keydown', (ev) => {
  if (ev.key === ' ') {
    renderStateStore.showText = !renderStateStore.showText
  } else if (ev.key === 'Enter') {
    if (!patternsStore.currentPattern) {
      patternsStore.currentPattern = 'chakras'
    }
    renderStateStore.showColors = !renderStateStore.showColors
    resume()
  }
})
