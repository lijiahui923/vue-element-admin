import store from '@/store'
import Layout from '@/layout'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 * 将后端传入的router字符串转化成vue-router可用的对象
 * @param jsonRouter 后台路由
 * @param t 占有变量，用于返回值（不需要传参）
 */
export function handleJsonRouterToAsyncRouter(jsonRouter, t) {
  t = jsonRouter.map(item => {
    console.log(item.component)
    if (item.component === 'Layout') {
      item.component = Layout
    } else if (item.component) {
      // 组件懒加载
      item.component = handleComponent(item.component)
    }
    return item
  })
  for (const item of t) {
    if (item.children) {
      item.children = handleJsonRouterToAsyncRouter(item.children)
    }
  }
  return t
}

function handleComponent(components) {
  // 可能会有bug(说找不到模板)：---解决方案安装babel-plugin-syntax-dynamic-import，在babel.config.js配置'plugins': ['syntax-dynamic-import']
  return () => import('@/views/' + components)
}
