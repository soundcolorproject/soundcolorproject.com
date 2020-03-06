
import { observable, action } from 'https://unpkg.com/mobx@5.x?module'
import { getAnalysis } from '../audio/getAnalysis.js'

export const analysisStore = observable({
  noise: 0,
  tones: [],
})

const setAnalysis = action(({ noise, tones }) => {
  analysisStore.noise = noise
  analysisStore.tones = tones
})

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function requestAnalysis() {
  setAnalysis(getAnalysis())
  // await sleep(100)
  requestAnimationFrame(requestAnalysis)
}

requestAnalysis()
