import auth from './auth'
import throttle from './button-throttle'
const directives = {}

directives.install = function(Vue) {
  Vue.directive('auth', auth)
  Vue.directive('throttle', throttle)
}

export default directives
