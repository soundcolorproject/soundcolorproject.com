
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'

export const DeviceChooser = injectAndObserve(
  ({ media }) => ({ media }),
  class DeviceChooser extends Component {
    onDeviceChange = (ev) => {
      this.props.media.currentDeviceId = ev.target.value
    }
    render ({ media }) {
      return html`
        <div id="device-chooser">
          <label>
            Audio Source <br/>
            <select value=${media.currentDeviceId} onchange=${this.onDeviceChange}>
              ${
                media.possibleDevices.map(({ deviceId, label }) => html`
                  <option value=${deviceId}>${label}</option>
                `)
              }
            </select>
          </label>
        </div>
      `
    }
  }
)
