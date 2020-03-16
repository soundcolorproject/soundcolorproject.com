
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'

export const SoundDetails = injectAndObserve(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class SoundDetails extends Component {
    renderDetails = ({ dB, frequency, note: { note, cents, octave } }, idx) => {
      return html`
        <div class="detail">
          <div>
            <span class="name">Volume </span>
            <span class="value">${dB.toFixed(0)} dB</span>
          </div>
          <div>
            <span class="name">Frequency </span>
            <span class="value">${frequency.toFixed(2)} hz</span>
          </div>
          <div>
            <span class="name">Note </span>
            <span class="value">${note} ${octave}</span>
          </div>
          <div>
            <span class="name">Cents </span>
            <span class="value">${cents.toFixed(2)}</span>
          </div>
        </div>
      `
    }

    renderEmptyDetails = () => html`
      <div class="detail">
        <div>
          <span class="name">dB </span>
          <span class="value">•</span>
        </div>
        <div>
          <span class="name">Frequency </span>
          <span class="value">•</span>
        </div>
        <div>
          <span class="name">Note </span>
          <span class="value">•</span>
        </div>
        <div>
          <span class="name">Cents </span>
          <span class="value">•</span>
        </div>
      </div>
    `

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

      return html`
        <div id="sound-details">
          ${Number.isFinite(noise) && html`
            <div class="detail">
              <span class="name">Noise level </span>
              <span class="value">${noise.toFixed(0)} dB</span>
            </div>
          `}
          ${
            tones.length > 0 
              ? this.renderDetails(tones[0])
              : this.renderEmptyDetails()
            
          }
        </div>
      `
    }
  }
)
