
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { StateProvider } from '../state/StateProvider.js'
import { Root } from './Root.js'

export class App extends Component {
  render (props, state) {
    return html`
      <${StateProvider}>
        <${Root} />
      </${StateProvider}>
    `
  }
}
