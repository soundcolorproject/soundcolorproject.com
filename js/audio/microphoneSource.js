
import { context, resumePromise } from './context.js';

const userMediaMap = new Map()
const audioSourceMap = new Map()

export async function getUserMedia(deviceId = 'default') {
  if (!userMediaMap.has(deviceId)) {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      }
    })
    userMediaMap.set(deviceId, media)
  }

  return userMediaMap.get(deviceId)
}


export async function getAudioSource(deviceId = 'default') {
  if (!audioSourceMap.has(deviceId)) {
    const stream = await getUserMedia(deviceId)
    await resumePromise
    const audioSource = context.createMediaStreamSource(stream)
    audioSourceMap.set(deviceId, audioSource)
  }

  return audioSourceMap.get(deviceId)
}
