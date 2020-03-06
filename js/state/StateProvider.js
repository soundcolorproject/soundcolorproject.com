
import { Provider } from 'https://unpkg.com/mobx-preact?module'
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'

import { analysisStore } from './analysisStore.js'
import { mediaStore } from './mediaStore.js'
import { patternsStore } from './patternsStore.js'
import { renderStateStore } from './renderStateStore.js'

export class StateProvider extends Component {
  render (props) {
    console.log('props', props);
    return html`
      <${Provider}
        analysis=${analysisStore}
        patterns=${patternsStore}
        media=${mediaStore}
        renderState=${renderStateStore}
      >
        ${[props.children]}
      </${Provider}>
    `
  }
}
