
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { PatternPicker } from './PatternPicker.js'
import { ColorRenderer } from './ColorRenderer.js'

export const Root = injectAndObserve(
  ({ media }) => ({ media }),
  class Root extends Component {
    render ({ media }) {
      if (media.ready) {
        return html`
          <div id="details-view">
            <h1>SoundColor</h1>
            <${PatternPicker}/>
            <${ColorRenderer}/>
          </div>
        `
      } else if (media.error) {
        return html`
          <div id="details-view">
            <h1>SoundColor</h1>
            <p>Something went wrong while initializing your microphone.</p>
            <p>Please allow microphone access and refresh the page.</p>
          </div>
        `
      } else {
        return html`
          <div id="details-view">
            <h1>SoundColor</h1>
            <p>Please allow microphone access to begin.</p>
          </div>
        `
      }
    }
  }
)
