
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'

export class Footer extends Component {
  render ({ children }) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    return html`
      <div id="spreader">
        <div id="footer">
          ${
            children.map((child, idx) => html`
              <div key=${idx} class="footer-item">${child}</div>
            `)
          }
        </div>
      </div>
    `
  }
}

