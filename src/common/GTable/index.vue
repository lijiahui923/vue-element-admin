<script>
import methods from './mixins/table-methods'
import storageColumn from './mixins/storage-column'
import GPagination from './components/GPagination'
import TrendsTable from './components/TrendsTable'
import GPopover from './components/GPopover'
import { isPlainObject, isFunction, omit } from 'lodash'
const defaultProps = {
  'highlight-current-row': true,
  'header-cell-style': { 'background-color': '#f8f8f9' }
}
const defaultColumnsProps = {
  'show-overflow-tooltip': true,
  'min-width': 100
}
export default {
  name: 'GTable',
  components: { GPagination, TrendsTable, GPopover },
  mixins: [methods, storageColumn],
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    paginationConfig: {
      type: Object,
      default: () => {}
    },
    columnsConfig: {
      type: Object,
      default: () => {}
    },
    // 是否需要显示隐藏
    visibleConfig: {
      type: Boolean,
      default: false
    },
    // 显示隐藏需要配置唯一标识
    keyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showColumnsOptions: [],
      elTableRef: 'EL_TABLE_REF'
    }
  },
  watch: {
    columns: {
      immediate: true,
      handler(columns) {
        const props = columns.map(item => {
          if (!item.prop) {
            item.prop = item.type
            item.label = item.type
          }
          if (item.type === 'operate') {
            item.label = '操作'
          }
          if (item.type === 'expand') {
            item.label = '>'
          }
          return item.prop
        })
        this.showColumnsOptions = props
        // 缓存列
        const visibleCol = this.getStorageVisibleColumns()
        if (visibleCol) {
          this.showColumnsOptions = visibleCol
        }
      }
    }
  },
  methods: {
    renderTable(h) {
      const { $attrs, $listeners } = this
      const columns = this.renderColumns(h)
      const $this = this
      const props = Object.assign({}, defaultProps, $attrs, { data: this.data })
      const newProps = omit(props, 'height')
      let headerToolsHeight = ''
      if (this.$refs['table-header-tools']) {
        headerToolsHeight = document.getElementsByClassName('header-tools')[0].clientHeight
      }
      return h(
        'el-table',
        {
          // 减去分页的高度 这20是内边距,这6是头部工具栏的下边距
          style: {
            height: this.paginationConfig
              ? props.height - (headerToolsHeight ? headerToolsHeight + 56 + 6 : 56) + 'px'
              : props.height - (headerToolsHeight ? headerToolsHeight + 20 + 6 : 20) + 'px'
          },
          props: {
            ...newProps
          },
          on: {
            ...$listeners,
            // 当拖动表头改变了列的宽度的时候会触发该事件
            'header-dragend': (newWidth, oldWidth, column) => {
              $this.$emit('header-dragend', newWidth, oldWidth, column)
              if ($this.visibleConfig) {
                $this.storageColumnsWidth({ [column.property]: newWidth })
              }
            }
          },
          ref: $this.elTableRef
        },
        [
          h(
            'template',
            {
              slot: 'append'
            },
            this.$slots.append
          ),
          ...columns
        ]
      )
    },
    renderColumns(h) {
      const columns = []
      for (let index = 0; index < this.columns.length; index++) {
        const columnConf = this.columns[index]
        if (!this.showColumnsOptions.includes(columnConf.prop)) {
          continue
        }
        const storageWidth = this.getStorageColumnsWidth()[columnConf.prop]
        if (storageWidth) {
          columnConf.width = storageWidth
        }
        if (columnConf.type === 'expand') {
          columns.push(this.renderColumnForExpand(h, columnConf))
        } else if (columnConf.type === 'operate') {
          columns.push(this.renderColumnForOperate(h, columnConf))
        } else {
          columns.push(this.renderColumn(h, columnConf))
        }
      }
      return columns
    },
    renderColumn(h, column) {
      const _column = Object.assign(column, defaultColumnsProps, this.columnsConfig)
      if (_column.type === 'selection') {
        _column.label = '复选框'
      }
      if (_column.type === 'index') {
        _column.label = '#'
      }
      const scopedSlots = {}; const scopedSlotsList = {}; const slots = []
      // 如果类型是一个对象说明有多个插槽需要循环渲染，其他的就是一个渲染默认的
      if (_column.slots && typeof _column.slots === 'object') {
        for (const key in _column.slots) {
          const scopedSlots = this.$scopedSlots[_column.slots[key]]
          scopedSlotsList[key] = props => {
            return scopedSlots(props)
          }
        }
      } else {
        const slotName = _column.slots
        const scopedSlot = this.$scopedSlots[slotName]
        const slot = this.$slots[slotName]
        if (scopedSlot) {
          scopedSlots.default = props => {
            return scopedSlot(props)
          }
        }
        if (slot) {
          slots.push(slot)
        }
      }
      const newCol = omit(_column, 'label')
      return h(
        'el-table-column',
        {
          props: {
            ...newCol,
            label: _column.label ? this.$t(_column.label) : ''
          },
          scopedSlots: Object.assign({}, scopedSlots, scopedSlotsList)
        },
        slots
      )
    },
    // 渲染展开列
    renderColumnForExpand(h, column) {
      const self = this
      const props = Object.assign({}, column, { label: '' })
      return h(
        'el-table-column',
        {
          props,
          scopedSlots: {
            default: props => {
              return self.$scopedSlots['expand'](props)
            }
          },
          key: column.prop
        }
      )
    },
    // 渲染操作列
    renderColumnForOperate(h, column) {
      // const self = this
      !column.fixed && (column.fixed = 'right')
      const props = Object.assign({}, column, { label: '操作 ' }, { 'show-overflow-tooltip': false })
      return h(
        'el-table-column',
        {
          props,
          scopedSlots: {
            default: param => {
              const { row, $index } = param
              // 给点击事件返回当前行数据、还有小标
              const buttons = this.handlerOperateButtons(column.buttons, row, $index)
              return [
                h('GButton', {
                  props: {
                    options: buttons
                  }
                  // attrs: {
                  //   type: 'text',
                  //   label: ''
                  // }
                })
              ]
            }
          },
          key: column.prop
        }
      )
    },
    handlerOperateButtons(confButtons, row, index) {
      const buttons = {}
      Object.keys(confButtons).forEach(button => {
        let btn = {}
        if (isPlainObject(confButtons[button])) {
          Object.assign(btn, confButtons[button])
        }
        if (confButtons[button].alert) {
          btn['confirmClick'] = () => {
            confButtons[button].alert.confirm(row, index)
          }
          btn['cancelClick'] = () => {
            confButtons[button].alert.cancel(row, index)
          }
        } else if (isFunction(confButtons[button])) {
          btn['click'] = () => {
            confButtons[button](row, index)
          }
        } else {
          btn['click'] = () => {
            confButtons[button]['click'](row, index)
          }
        }
        btn = this.handleButtonStatus(btn, ['visible', 'disabled'], row, index)
        buttons[button] = Object.assign({}, confButtons[button], btn)
      })
      return buttons
    },
    handleButtonStatus(item, keys, row, index) {
      const _item = Object.assign({}, item)
      keys.forEach(key => {
        if (isFunction(item[key])) {
          _item[key] = item[key](row, index)
        }
      })
      return _item
    },
    // 分页如果this.paginationConfig就渲染
    renderPagination(h) {
      if (this.paginationConfig) {
        return h(
          'GPagination',
          {
            attrs: this.paginationConfig,
            on: this.$listeners
          }
        )
      }
    },
    // 渲染隐藏列
    renderPopver(h) {
      if (!this.visibleConfig) return
      const props = { columnList: this.columns, checked: this.showColumnsOptions }
      return h(
        'TrendsTable',
        {
          style: 'margin-left: 10px',
          props,
          on: {
            change: (val) => {
              this.showColumnsOptions = val
              this.storageVisibleColumns(val)
              // 隐藏列的时候防治表格错位
              this.$nextTick(() => {
                this.$refs[this.elTableRef].doLayout()
              })
            }
          }
        }
      )
    },
    renderTableHeader(h) {
      if (this.visibleConfig || (this.$scopedSlots.headerLeft || this.$scopedSlots.headerRight)) {
        return h('div', {
          class: 'header-tools',
          ref: 'table-header-tools'
        }, [
          h('div', {
            class: 'header-left'
          }, [
            this.$scopedSlots.headerLeft && this.$scopedSlots.headerLeft()
          ]),
          h('div', {
            class: 'header-right'
          }, [
            this.$scopedSlots.headerRight && this.$scopedSlots.headerRight(),
            this.renderPopver(h)
          ])
        ])
      }
    }
  },
  render(h) {
    return h(
      'div',
      {
        style: 'position: relative'
      },
      [
        this.renderTableHeader(h),
        this.renderTable(h),
        this.renderPagination(h)
      ]
    )
  }
}
</script>

<style scoped>
.header-tools {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
</style>
