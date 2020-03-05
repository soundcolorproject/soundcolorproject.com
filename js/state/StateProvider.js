
import { Provider } from 'https://unpkg.com/mobx-preact?module'
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'

import { mediaStore } from './mediaStore.js'
import { patternsStore } from './patternsStore.js'

export class StateProvider extends Component {
  render (props) {
    console.log('props', props);
    return html`
      <${Provider}
        patterns=${patternsStore}
        media=${mediaStore}
      >
        ${[props.children]}
      </${Provider}>
    `
  }
}
