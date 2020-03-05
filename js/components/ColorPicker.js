
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { context } from '../audio/context.js'

export const ColorPicker = injectAndObserve(
  ({ patterns }) => ({ patterns }),
  class ColorPicker extends Component {
    componentWillReceiveProps (newProps) {

    }
    createPicker = (el) => {
      if (this.picker) {
        return
      }
      const { patterns, note } = this.props
      const customColors = patterns.patternData.custom.colors
      this.picker = Pickr.create({
        el: el,
        theme: 'nano',
        useAsButton: true,
        default: customColors[note],
        components: {
          palette: false,
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
            input: true,
            save: true,
            cancel: true,
          },
        },
      })
      
      this.picker.on('cancel', (instance) => {
        instance.hide()
      })

      this.picker.on('save', (color, instance) => {
        customColors[note] = color.toHEXA().toString(2)
        instance.hide()
      })
    }

    render ({ note, patterns }) {
      const customColors = patterns.patternData.custom.colors
      const noteDesc = note.indexOf('#') > 1
        ? `${note[0]} Sharp`
        : note
      return html`
        <button
          ref=${this.createPicker}
          type="button"
          role="button"
          aria-label="custom color for note ${noteDesc}"
          style="background: ${customColors[note]}"
        >
          ${note}
        </button>
      `
    }
  },
)