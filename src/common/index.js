import { isObject, isArray } from 'lodash'
const context = require.context('./', true, /index\.(vue|js)$/)
const keys = context.keys()
const components = []
const requireComponent = {}
keys.forEach(key => {
  if (key.startsWith('./index')) {
    return false
  }
  const compileComponent = context(key)
  const matchComponent = compileComponent.default || compileComponent
  if (matchComponent.name) {
    requireComponent[matchComponent.name] = matchComponent
    components.push(matchComponent)
  } else if (isObject(matchComponent)) {
    for (const key in matchComponent) {
      const item = matchComponent[key]
      if (item.name) {
        components.push(item)
        requireComponent[item.name] = item
      }
    }
  } else if (isArray(matchComponent)) {
    matchComponent.forEach(item => {
      if (item.name) {
        components.push(item)
        requireComponent[item.name] = item
      }
    })
  } else {
    console.log('组件注册错误' + key)
  }
})

const install = Vue => {
  components.forEach(component => {
    if (component.name && component.name !== 'App') {
      Vue.component(component.name, component)
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...requireComponent
}
