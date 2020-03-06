
import { context, resumePromise } from './context.js';

let media
let source

export async function getUserMedia() {
  if (!media) {
    media = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  }
  return media
}

export async function getMicrophoneSource() {
  if (!source) {
    source = (async () => {
      const stream = await getUserMedia()
      await resumePromise
      return context.createMediaStreamSource(stream)
    })()
  }

  return source
}
