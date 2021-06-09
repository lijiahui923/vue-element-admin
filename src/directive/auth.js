export default {
  inserted: function(el, binding, vnode, oldVnode) {
    // 从路由中获取当前页面的权限
    const permission = vnode.context.$route.meta && vnode.context.$route.meta.permission || []
    const hasPermission = permission.find(item => item.value === vnode.key)
    if (!hasPermission) {
      // 没有权限，移除节点
      el.parentNode.removeChild(el)
    }
  }
}
