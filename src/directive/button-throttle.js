export default {
  bind: function(el, binding, vnode) {
    // 监听click事件
    el.addEventListener('click', () => {
      console.log('el.addEventListener', vnode.context.$store.getters.appointedInterface(binding.value))
      // 判断正在执行的接口集合是否存在在当前接口
      if (vnode.context && vnode.context.$store.getters.appointedInterface(binding.value)) {
        // 如果存在，在禁用当前绑定元素
        el.setAttribute('disabled', 'disabled')
        // 添加类名is-loading
        el.classList.add('is-loading')
        const content = el.children[0]
        // 创建i标签
        const loading = document.createElement('i')
        // 设置标签图标
        loading.setAttribute('class', 'el-icon-loading')
        // 将加载中的标签插入到绑定的元素中
        el.insertBefore(loading, content)
        // 设置计时器，每隔100毫秒调用一次
        const intervalId = setInterval(function() {
        // 如果当前接口已完成
          if (!vnode.context.$store.getters.appointedInterface(binding.value)) {
            // 移除节点上的禁用属性
            el.removeAttribute('disabled')
            // 移除节点上的is-loading类
            el.classList.remove('is-loading')
            const node = el.children[0]
            // 删除加载中的标签
            el.removeChild(node)
            // 清除定时器
            clearInterval(intervalId)
          }
        })
      }
    })
  }
}
