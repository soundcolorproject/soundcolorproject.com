
import { context, resumePromise } from './context.js';

let media
let sourceId
let source

export async function getUserMedia(deviceId = 'default') {
  if (!media) {
    media = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      }
    })
  }
  return media
}

const sources = new Map()

export async function getAudioSource(deviceId = 'default') {
  if (!source || deviceId != sourceId) {
    source = (async () => {
      sourceId = deviceId
      if (sources.has(deviceId)) {
        return sources.get(deviceId)
      }
      const stream = await getUserMedia(deviceId)
      await resumePromise
      const audioSource = context.createMediaStreamSource(stream)
      sources.set(deviceId, audioSource)

      return audioSource
    })()
  }

  return source
}
