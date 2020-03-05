
import { Component } from 'https://unpkg.com/preact?module'
import { getFft } from '../audio/analyzer'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { context } from '../audio/context.js'
import { ColorPicker } from './ColorPicker.js'

export const ColorRenderer = injectAndObserve(
  ({ patterns }) => ({ patterns }),
  class ColorRenderer extends Component {
    setPattern (pattern) {
      context.resume()
      console.log('setPattern', pattern)
      this.props.patterns.currentPattern = pattern
    }

    renderCustomButtons () {
      if (this.props.patterns.currentPattern === 'custom') {
        return html`
          <div id="custom-colors">
            ${
              this.props.patterns.notes.map(note => html`
                <${ColorPicker} note=${note} />
              `)
            }
          </div>
        `
      }
    }

    render ({ patterns }) {
      const { currentPattern, possiblePatterns } = patterns
      return html`
        <div>
          ${
            possiblePatterns.map(pattern => html`
              <button type="button" onclick="${() => this.setPattern(pattern)}" class="${pattern === currentPattern ? 'selected' : ''}">
              ${pattern}
              </button>
            `)
          }
          ${this.renderCustomButtons()}
        </div>
      `
    }
  },
)