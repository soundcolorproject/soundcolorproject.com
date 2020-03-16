
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { PatternPicker } from './PatternPicker.js'
import { ColorRenderer } from './ColorRenderer.js'
import { SoundDetails } from './SoundDetails.js'
import { TextHider } from './TextHider.js'
import { Shortcuts } from './Shortcuts.js'
import { Footer } from './Footer.js'
import { MiniAnalyser } from './MiniAnalyser.js'
import { Sliders } from './Sliders.js'

export const Root = injectAndObserve(
  ({ media }) => ({ media }),
  class Root extends Component {
    render ({ media }) {
      if (media.ready) {
        return html`
          <div id="details-view">
            <${ColorRenderer}/>
            <${TextHider}>
              <h1>SoundColor</h1>
              <p>Select a color pattern:</p>
              <${PatternPicker}/>
              <label>
                  <input type="checkbox" />
                  Monochromatic
              </label>
              <${SoundDetails}/>
              <${MiniAnalyser}/>
              <${Footer}>
                <div id="shortcuts">
                  <h2>
                    Keyboard shortcuts
                  </h2>
                  <ul>
                    <li><span>'space'</span> = show/hide details</li>
                    <li><span>'enter'</span> = stop/start color pattern</li>
                  </ul>
                </div>
                <${Sliders}/>
              </${Footer}>
              <div id="info">
                <a aria-label="About Sound Color Project" href="/info.html">Info</a>
              </div>
            </${TextHider}>
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
