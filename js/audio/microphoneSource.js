
import { context } from './context.js';

let source

export async function getMicrophoneSource() {
  if (!source) {
    source = (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      return context.createMediaStreamSource(stream)
    })()
  }

  return source
}
