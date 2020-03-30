
import { render } from 'https://unpkg.com/preact?module'
import { App } from './components/App.js'
import { html } from './html.js'

render(html`<${App} />`, document.body, document.getElementById('root'))
