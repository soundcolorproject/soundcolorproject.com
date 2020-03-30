
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { dBtoVolume } from '../audio/getAnalysis.js'

const BASE = 1.5
export const MiniAnalyser = injectAndObserve(
  ({ analysis }) => ({ analysis }),
  class MiniAnalyser extends Component {
    render ({ analysis }) {
      analysis.tones // required in order to force-re-render on update
      const { miniFft } = analysis
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
