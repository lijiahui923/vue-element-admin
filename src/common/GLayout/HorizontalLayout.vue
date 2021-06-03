<script>
/**
@description:
@createTime:2021-06-01
@create:lijiahui
*/
export default {
  name: 'HorizontalLayout',
  props: {
    left: {
      type: Number,
      default: 6
    },
    right: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {
      // 页面高度
      pageHeight: 0,
      // 左边高度
      leftBottomHeight: 0,
      rightBottomHeight: 0
    }
  },
  computed: {
    // 左边宽度百分数一共分24列
    leftWidth() {
      return this.left ? (this.left / 24) * 100 : (this.left ? 100 - this.rightWidth : 50)
    },
    rightWidth() {
      return this.right ? (this.right / 24) * 100 : (this.left ? 100 - this.leftWidth : 50)
    }
  },
  watch: {
    '$store.getters.mainBodyH': {
      immediate: true,
      handler(val) {
        this.pageHeight = val - 20
        this.updateHeight()
      }
    }
  },
  mounted() {},
  created() {
    window.addEventListener('resize', this.updateHeight)
  },
  methods: {
    // 提供给外部调用，用来刷新作用域中的高度
    updateHeight() {
      this.$nextTick(function() {
        if (this.$slots.leftTop || this.$scopedSlots.leftTop) {
          this.leftBottomHeight = this.pageHeight - this.$refs['leftTopPart'].offsetHeight - 6
        }
        if (this.$slots.rightTop || this.$scopedSlots.rightTop) {
          this.rightBottomHeight = this.pageHeight - this.$refs['rightTopPart'].offsetHeight - 6
        }
      })
    },
    getItem(h) {
      const items = []
      // // 默认插槽用于放置一些弹窗等不会影响布局内容
      if (this.$slots.default) {
        items.push(this.$slots.default)
      }
      // // 左右分栏
      if (this.$slots.left || this.$scopedSlots.left) {
        items.push(this.getCol(h, 'left'))
      } else {
        // 如果存在左上和左下的的插槽
        if (this.$slots.leftTop && (this.$slots.leftBottom || this.$scopedSlots.leftBottom)) {
          items.push(this.getVerticalPart(h, 'left'))
        }
      }
      if (this.$slots.right || this.$scopedSlots.right) {
        items.push(this.getCol(h, 'right'))
      } else {
        console.log(this.$slots)
        if (this.$slots.rightTop && (this.$slots.rightBottom || this.$scopedSlots.rightBottom)) {
          items.push(this.getVerticalPart(h, 'right'))
        }
      }
      return items
    },
    getCol(h, position) {
      return h('div', {
        style: {
          width: this[position + 'Width'] + '%'
        },
        class: {
          'col-container': true
        }
      }, [
        this.$slots[position] || this.$scopedSlots[position]({
          height: this.pageHeight
        })
      ])
    },
    getVerticalPart(h, position) {
      const upperPosistion = position === 'left' ? 'left' : 'right'
      return h('div', {
        style: {
          width: this[position + 'Width'] + '%'
        },
        class: {
          'col-container': true
        }
      }, [
        h('div', {
          ref: upperPosistion + 'TopPart',
          class: {
            'top-container': true
          }
        }, [
          this.$slots[position + 'Top']
        ]),
        h('div', {
          class: {
            'bottom-contanier': true
          },
          style: {
            height: this[position + 'BottomHeight'] + 'px'
          }
        }, [
          this.$slots[position + 'Bottom'] || this.$scopedSlots[position + 'Bottom']({
            height: this[position + 'BottomHeight']
          })
        ])
      ])
    }
  },
  render(h) {
    const items = this.getItem(h)
    return h('main-layout', [...items])
  }
}
</script>
<style lang='scss' scoped>
.col-container {
  display: inline-block;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
}
.top-container {
  margin-bottom: 6px;
}
</style>
