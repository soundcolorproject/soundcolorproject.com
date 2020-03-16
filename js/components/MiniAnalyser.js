
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { dBtoVolume } from '../audio/getAnalysis.js'

const BASE = 1.5
export const MiniAnalyser = injectAndObserve(
  ({ analysis }) => ({ analysis }),
  class MiniAnalyser extends Component {
    render ({ analysis: { miniFft, tones } }) {
      // const heights = [...miniFft].map(dB => Math.max(0, Math.min(100 + dB, 100)))
      const heights = [...miniFft].map(dB => (BASE ** (dB / 10)) * 100)
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
