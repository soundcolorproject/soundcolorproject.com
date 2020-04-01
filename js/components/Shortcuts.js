
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'

export class Shortcuts extends Component {
  render () {
    return html`
      <div id="shortcuts">
        <div>
          <p><span>'space'</span> = show/hide details</p><button aria-label="Hide page details">Hide Details</button>
        </div>
        <div>
          <p><span>'enter'</span> = stop/start color pattern</p><button aria-label="Stop the color pattern">Stop Color Pattern</button>
        </div>
          ${
            document.fullscreenEnabled
              ? html`<p><span>'f'</span> = enter/leave fullscreen</p><button aria-label="Enter fullscreen mode">Enter Fullscreen</button>`
              : ''
          }
      </div>
    `
  }
}
