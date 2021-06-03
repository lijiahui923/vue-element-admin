<template>
  <div class="page-container">
    <div ref="topPart" class="top-container">
      <slot name="top" />
    </div>
    <div :style="{'height': buttomHeight + 'px'}" class="buttom-container">
      <slot name="buttom" :height="buttomHeight" />
    </div>
  </div>
</template>

<script>
/**
@description:上下布局
@createTime:2021-05-28
@create:lijiahui
*/
export default {
  name: 'VerticalLayout',
  props: {},
  data() {
    return {
      pageHeight: 0,
      buttomHeight: 0
    }
  },
  watch: {
    '$store.getters.mainBodyH': {
      immediate: true,
      handler(val) {
        // 这个地方的20是app-container内边距
        this.pageHeight = val - 20
        this.updateHeight()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.pageHeight = this.$store.getters.mainBodyH - 20
      this.updateHeight()
    })
  },
  created() {},
  methods: {
    updateHeight() {
      this.$nextTick(() => {
        // 这个10是buttom-container距离上面的距离
        this.buttomHeight = this.pageHeight - this.$refs['topPart'].offsetHeight - 10
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .buttom-container {
    margin-top: 10px;
  }
}
</style>
