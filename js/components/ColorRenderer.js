
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { hsvToHex } from '../color/colorHelpers.js'

const BASE = 1.1
const MULT = 12
const levelOld = (value) => Math.pow(BASE, value) * MULT
const level = (value) => (value) / 100
const levelNoise = (value) => (value) / 60
function getColorsFromAnalysis(colorMap, { noise, tones }) {
  const saturationMult = Math.max(0, Math.min(1 - levelNoise(noise), 1))
  return tones.map(({ dB, note: { note } }) => {
    const valueMult = Math.max(0, Math.min(level(dB), 1))
    const { h, s, v } = colorMap[note]

    return hsvToHex({
      h,
      s: s * saturationMult,
      v: v * valueMult,
    })
  })
}

export const ColorRenderer = injectAndObserve(
  ({ analysis, patterns, renderState }) => ({ analysis, patterns, renderState }),
  class ColorRenderer extends Component {
    render ({ analysis, patterns: { currentPattern, patternData }, renderState: { showColors } }) {
      if (!showColors) {
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
