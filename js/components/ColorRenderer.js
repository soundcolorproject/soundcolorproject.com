
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { hsvToHex, hsvToRgb, rgbToHsv } from '../color/colorHelpers.js'
import { dBtoVolume } from '../audio/getAnalysis.js'

const smoothValues = {
  s: 0,
  v: 0,
  r: 0,
  g: 0,
  b: 0,
}

function smooth (color, key, delta, speed) {
  const smoothingVal = (1 - speed) ** (delta)
  return smoothValues[key] = smoothValues[key] * smoothingVal + color[key] * (1 - smoothingVal)
}

let lastTime = Date.now()
function getColorsFromAnalysis(colorMap, { noise, tones }, { transitionSpeed, noiseMultiplier, vibranceMultiplier }) {
  noiseMultiplier = noiseMultiplier >= 0 ? 2 ** noiseMultiplier : 0
  vibranceMultiplier = 2 ** vibranceMultiplier
  const saturationMult = Math.max(0, Math.min(1 - (dBtoVolume(noise) * noiseMultiplier), 1))
  const newTime = Date.now()
  const delta = (newTime - lastTime) / 1000
  lastTime = newTime
  return tones.map(({ dB, note: { note } }) => {
    const valueMult = Math.max(0, Math.min(dBtoVolume(dB) * vibranceMultiplier, 1))
    const hsv = { ...colorMap[note] }
    hsv.s *= saturationMult
    hsv.v *= valueMult

    const rgb = hsvToRgb(hsv)
    const { h } = rgbToHsv({
      r: smooth(rgb, 'r', delta, transitionSpeed),
      g: smooth(rgb, 'g', delta, transitionSpeed),
      b: smooth(rgb, 'b', delta, transitionSpeed),
    })

    return hsvToHex({
      h: h,
      s: smooth(hsv, 's', delta, transitionSpeed),
      v: smooth(hsv, 'v', delta, transitionSpeed),
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
