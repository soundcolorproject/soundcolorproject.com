
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'

export const MiniAnalyser = injectAndObserve(
  ({ analysis }) => ({ analysis }),
  class MiniAnalyser extends Component {
    render ({ analysis: { miniFft, tones } }) {
      const heights = [...miniFft].map(dB => Math.max(0, Math.min((100 + dB) / 0.8, 100)))
      return html`
        <div id="mini-analyser">
          ${
            heights.map((height, idx) => html`
              <div class="bar" key=${idx} style="height: ${height}%" />
            `)
          }
        </div>
      `
    }
  },
)
