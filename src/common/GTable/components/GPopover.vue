<template>
  <div>
    <el-popover
      placement="right"
      width="400"
      trigger="click"
    >
      <slot />
      <slot name="button">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
      </slot>
      <el-button slot="reference">按钮的文字</el-button>
    </el-popover>
  </div>
</template>

<script>
/**
@description:Popover 弹出框
@createTime:2021-05-28
@create:lijiahui
*/
export default {
  name: 'GPopover',
  props: {},
  data() {
    return {
      visible: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    console.log('created')
  },
  methods: {}
}
</script>
<style lang='scss' scoped></style>
