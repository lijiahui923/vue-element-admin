<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      pageHeight: 0
    }
  },
  watch: {
    '$store.getters.mainBodyH': {
      immediate: true,
      handler(val) {
        this.pageHeight = val
      }
    }
  },
  render(h) {
    return h('div', {
      class: {
        'layout-container': true
      }
    }, [
      this.$slots.default || this.$scopedSlots.default({
        height: this.pageHeight
      })
    ])
  }
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100%;
}
</style>
