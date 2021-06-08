<script>
/**
@description: 下拉框
@createTime:2021-05-28
@create:lijiahui
*/
export default {
  name: 'GSelect',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number | Array
    },
    options: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      selectVal: ''
    }
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.selectVal = val
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    renderOptions(h, options, arr = []) {
      options.map(option => {
        // 有children就代表有分组
        if (option[this.defaultProps.children] && option[this.defaultProps.children].length) {
          arr.push(h('el-option-group', {
            props: {
              label: option[this.defaultProps.label],
              disabled: option.disabled ? option.disabled : false
            }
          },
          this.renderOptions(h, option[this.defaultProps.children])
          ))
        } else {
          arr.push(h('el-option', {
            props: {
              value: option[this.defaultProps.value] !== undefined ? option[this.defaultProps.value] : option,
              label: option[this.defaultProps.label] ? option[this.defaultProps.label]
                : (option[this.defaultProps.value] ? option[this.defaultProps.value] : option),
              disabled: option.disabled ? option.disabled : false
            }
          },
          // 自定义模板
          this.$scopedSlots.default && this.$scopedSlots.default({ option })
          ))
        }
      })
      return arr
    }
  },
  render(h) {
    const _this = this
    const props = Object.assign({}, { value: _this.selectVal }, _this.$attrs)
    return h('el-select', {
      style: {
        'width': '100%'
      },
      props,
      on: {
        ..._this.$listeners,
        input: (val) => {
          _this.selectVal = val
          _this.$emit('input', val)
        }
      },
      ref: 'REF_SELECT'
    }, [
      h('template', { slot: 'prefix' }, this.$slots.prefix),
      h('template', { slot: 'empty' }, this.$slots.empty),
      ..._this.renderOptions(h, _this.options)
    ])
  }
}
</script>
<style lang='scss' scoped></style>
