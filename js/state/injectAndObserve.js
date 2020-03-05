
import { inject, observer } from 'https://unpkg.com/mobx-preact?module'

export function injectAndObserve(injector, component) {
  return inject(injector)(observer(component))
}
