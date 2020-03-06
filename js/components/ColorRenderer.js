
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { hsvToHex } from '../color/colorHelpers.js'

const BASE = 1.1
const MULT = 8
function getColorsFromAnalysis(colorMap, { noise, tones }) {
  const saturationMult = Math.max(0, Math.min(1 - noise, 1))
  return tones.map(({ dB, note: { note } }) => {
    const valueRaw = Math.pow(BASE, dB) * MULT
    const valueMult = Math.max(0, Math.min(valueRaw, 1))
    const { h, s, v } = colorMap[note]

    return hsvToHex({
      h,
      s: s * saturationMult,
      v: v * valueMult,
    })
  })
}

export const ColorRenderer = injectAndObserve(
  ({ analysis, patterns }) => ({ analysis, patterns }),
  class ColorRenderer extends Component {
    render ({ analysis, patterns: { currentPattern, patternData } }) {
      if (!currentPattern) {
        return null
      }
      const colorMap = patternData[currentPattern].colors
      const colors = getColorsFromAnalysis(colorMap, analysis)

      return html`
        <div id="background-colors">
          ${
            colors.map((color, idx) => html`
              <div class="color" key=${idx} style="background: ${color}" />
            `)
          }
        </div>
      `
    }
  },
)
