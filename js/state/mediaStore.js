
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

async function setDevice (newDeviceId) {
  const newAudioSource = await getAudioSource(newDeviceId)
  setSource1(newAudioSource)
  setSource2(newAudioSource)
}

reaction(
  () => mediaStore.currentDeviceId,
  setDevice,
)

getUserMedia().then(() => {
  mediaStore.ready = true
}).catch(() => {
  mediaStore.error = true
})

async function updateDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const possibleDevices = devices.filter(({ kind }) => kind === 'audioinput')
  mediaStore.possibleDevices = possibleDevices
  const currentDeviceId = mediaStore.currentDeviceId
  if (!possibleDevices.some(({ deviceId }) => deviceId === currentDeviceId)) {
    mediaStore.currentDeviceId = 'default'
  } else {
    setDevice(mediaStore.currentDeviceId)
  }
}

navigator.mediaDevices.addEventListener('devicechange', updateDevices)
updateDevices()
