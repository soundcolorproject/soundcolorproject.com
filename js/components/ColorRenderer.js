
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { hsvToHex } from '../color/colorHelpers.js'
import { dBtoVolume } from '../audio/getAnalysis.js'

function getColorsFromAnalysis(colorMap, { noise, tones }, { noiseMultiplier, vibranceMultiplier }) {
  noiseMultiplier = noiseMultiplier >= 0 ? 2 ** noiseMultiplier : 0
  vibranceMultiplier = 2 ** vibranceMultiplier
  const saturationMult = Math.max(0, Math.min(1 - (dBtoVolume(noise) * noiseMultiplier), 1))
  return tones.map(({ dB, note: { note } }) => {
    const valueMult = Math.max(0, Math.min(dBtoVolume(dB) * vibranceMultiplier, 1))
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
    render ({ analysis, patterns, renderState: { showColors } }) {
      if (!showColors) {
        return null
      }
      const { currentPattern, patternData } = patterns
      const colorMap = patternData[currentPattern].colors
      const colors = getColorsFromAnalysis(colorMap, analysis, patterns)

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
