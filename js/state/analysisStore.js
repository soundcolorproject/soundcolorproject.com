
import { observable, action } from 'https://unpkg.com/mobx@5.x?module'
import { getAnalysis } from '../audio/getAnalysis.js'
import { getMiniFft } from '../audio/miniAnalyser.js'

export const analysisStore = observable({
  noise: 0,
  tones: [],
  miniFft: [],
})

const setAnalysis = action('setAnalysis', ({ noise, tones }, miniFft) => {
  analysisStore.noise = noise
  analysisStore.tones = tones
  analysisStore.miniFft = miniFft
})

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function requestAnalysis() {
  setAnalysis(getAnalysis(), getMiniFft())
  // await sleep(100)
  requestAnimationFrame(requestAnalysis)
}

requestAnalysis()
