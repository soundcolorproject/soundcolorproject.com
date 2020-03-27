
import { observable, reaction } from 'https://unpkg.com/mobx@5.x?module'
import { getUserMedia, getAudioSource } from '../audio/microphoneSource.js'
import { setSource as setSource1 } from '../audio/analyzer.js'
import { setSource as setSource2 } from '../audio/miniAnalyser.js'

export const mediaStore = observable({
  ready: false,
  error: false,
  possibleDevices: [],
  currentDeviceId: 'default',
})

reaction(
  () => mediaStore.currentDeviceId,
  async (newDeviceId) => {
    const newAudioSource = await getAudioSource(newDeviceId)
    setSource1(newAudioSource)
    setSource2(newAudioSource)
  }
)

getUserMedia().then(() => {
  mediaStore.ready = true
}).catch(() => {
  mediaStore.error = true
})

async function updateDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  mediaStore.possibleDevices = devices.filter(({ kind }) => kind === 'audioinput')
  console.log('devices', devices)
}

navigator.mediaDevices.addEventListener('devicechange', updateDevices)
updateDevices()
