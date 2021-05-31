import auth from './auth'

const directives = {}

directives.install = function(Vue) {
  Vue.directive('auth', auth)
}

export default directives
