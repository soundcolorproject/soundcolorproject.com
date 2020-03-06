
import { observable } from 'https://unpkg.com/mobx@5.x?module'
import { getUserMedia } from '../audio/microphoneSource.js'

export const mediaStore = observable({
  ready: false,
  error: false,
})

getUserMedia().then(() => {
  mediaStore.ready = true
}).catch(() => {
  mediaStore.error = true
})
