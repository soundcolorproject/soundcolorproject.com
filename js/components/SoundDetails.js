
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { MIN_FOR_STATS } from '../audio/getAnalysis.js'

export const SoundDetails = injectAndObserve(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class SoundDetails extends Component {
    render ({ analysis: { noise, tones }, patterns: { currentPattern }, renderState: { showColors } }) {
      if (!currentPattern) {
        return html`
          <h2>Please select a color pattern to begin</h2>
        `
      }
      if (!showColors) {
        return html`
          <h2>Pless enter again to resume the color pattern</h2>
        `
      }
      const noiseDB = MIN_FOR_STATS + (noise * -MIN_FOR_STATS)

      return html`
        <div id="sound-details">
          <div class="detail">
            <span class="name">Noise level </span>
            <span class="value">${noiseDB.toFixed(0)} dB</span>
          </div>
          ${
            tones.map(({ dB, frequency, note: { note, cents, octave } }, idx) => {
              return html`
                <div class="detail">
                  <span class="name">${note} ${octave}</span>
                  <div>
                    <span class="name">Loudness </span>
                    <span class="value">${dB.toFixed(0)} dB</span>
                  </div>
                  <div>
                    <span class="name">Cents </span>
                    <span class="value">${cents.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span class="name">Frequency </span>
                    <span class="value">${frequency.toFixed(2)} hz</span>
                  </div>
                </div>
              `
            })
          }
        </div>
      `
    }
  }
)
