
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'

export class Shortcuts extends Component {
  render () {
    return html`
      <div id="shortcuts">
        <h2>
          Keyboard shortcuts
        </h2>
        <ul>
          <li><span>'space'</span> = show/hide details</li>
          <li><span>'enter'</span> = stop/start color pattern</li>
        </ul>
      </div>
    `
  }
}
