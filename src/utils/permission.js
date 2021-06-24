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

/**
 * 将 vue 路由转换为 json 字符串
 * 将 asyncRouters 的 roles 初始化为空，同时处理 Component 的懒加载：
 * component: () => import('../views/home/Home') 转换为 component: 'views/home/Home'
 * @param asyncRouters
 * @returns {Promise<void>} 处理后的 asyncRouters JSON 字符串
 */
export async function handleAsyncRouterToJson(asyncRouters) {
  // 先把路由树中的每个节点的 roles 重置为 []，即每个人都可以访问
  for (const item of asyncRouters) {
    if (item.meta && item.meta.roles) {
      item.meta.roles = []
    }
    if (item.children) {
      await handleAsyncRouterToJson(item.children)
    }
    // 当遍历到 *（404）路由时，说明遍历完成，接着去处理 Component 的懒加载
    if (item.path === '*') {
      return await handleAsyncRouterComponentToJson(asyncRouters)
    }
  }
}
/**
 * 处理 Component 的懒加载
 * component: () => import('../views/home/Home') 转换为 component: 'views/home/Home'
 * @param asyncRouters
 * @returns {Promise<void>}
 */
export async function handleAsyncRouterComponentToJson(asyncRouters) {
  for (const item of asyncRouters) {
    // 如果 component 是懒加载，则执行它
    if (typeof item.component === 'function') {
      const c = await item.component()
      // 使用正则表达式将地址中的 src 替换
      item.component = c.default.__file.replace(/src\//, '')
    } else if (item.component) {
      item.component = item.component.name
    }
    if (item.children) {
      await handleAsyncRouterComponentToJson(item.children)
    }
    // 当遍历到 * （404）路由时，说明遍历完成
    if (item.path === '*') {
      // 去除 404 路由，在新增路由时自动添加
      asyncRouters.pop()
      return asyncRouters
    }
  }
}
