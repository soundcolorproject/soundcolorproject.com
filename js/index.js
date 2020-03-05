
import { render } from 'https://unpkg.com/preact?module'
import { App } from './components/App.js'
import { html } from './html.js'

// const data = html`<${App}>asdf</${App}>`

render(html`<${App} />`, document.body, document.getElementById('root'))
