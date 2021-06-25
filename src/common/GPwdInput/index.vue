<template>
  <div
    :class="[inputSize ? 'el-input--' + inputSize: '',
             {
               'pw_input_cp': true,
               'el-input': true,
               'el-input--prefix': $slots.prefix,
               'el-input--suffix': $slots.suffix || clearable
             }]"
  >
    <!-- 前面图标 -->
    <span class="el-input__prefix">
      <span class="el-input__icon">
        <slot name="prefix" />
      </span>
    </span>
    <input
      ref="input"
      class="el-input__inner"
      :placeholder="$te(placeholder) ? $t(placeholder) : placeholder"
      :disabled="disabled"
      :readonly="readonly"
      autocomplete="off"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    >
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i
          v-show="showClearable"
          class="el-input__icon el-icon-circle-close el-input__clear"
          @mousedown.prevent
          @click="clear"
        />
        <span class="el-input__icon">
          <slot name="suffix" />
        </span>
      </span>
    </span>
  </div>
</template>

<script>
/**
@description: 浏览器不要记住密码,密码框
@createTime:2021-06-24
@create:lijiahui
*/
import Cookies from 'js-cookie'

// 自定义密码输入框
// input元素光标操作
class CursorPosition {
  constructor(_inputEl) {
    this._inputEl = _inputEl
  }
  // 获取光标的位置前后以及中间字符
  get() {
    const rangeData = { text: '', start: 0, end: 0 }
    let i = 0
    if (this._inputEl && this._inputEl.setSelectionRange) { // W3C
      rangeData.start = this._inputEl.selectSart
      rangeData.end = this._inputEl.selectEnd
      rangeData.text = (rangeData.start !== rangeData.end) ? this._inputEl.value.substring(rangeData.start, rangeData.end) : ''
    } else if (this._inputEl && document.selection) { // IE
      const oS = document.selection.createRange()
      const oR = document.body.createTextRange()
      oR.moveToElementText(this._inputEl)
      rangeData.text = oS.text
      rangeData.bookmark = oS.getBookmark()
      for (i; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart('character', -1) !== 0; i++) {
        if (this._inputEl.value.charAt(i) === '\r') { i++ }
      }
      rangeData.start = i
      rangeData.end = rangeData.text.length + rangeData.start
    }
    return rangeData
  }
  // 写入光标的位置
  set(rangeData) {
    let oR
    if (!rangeData) { console.log('You must get cursor position first.') }
    if (this._inputEl && this._inputEl.setSelectionRange) { // WSC
      this._inputEl.setSelectionRange(rangeData.start, rangeData.end)
    } else if (this._inputEl && this._inputEl.createTextRange) { // IE
      oR = this._inputEl.createTextRange()
      if (this._inputEl.value.length === rangeData.start) {
        oR.collapse(false)
        oR.select()
      } else {
        oR.moveToBookmark(rangeData.bookmark)
        oR.select()
      }
    }
  }
}
export default {
  name: 'GPwdInput',
  // 注入formItem，用于获取formitem中定义尺寸
  inject: {
    elFormItem: {
      default: ''
    }
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    // 自定义密码符号
    replaceSymbol: {
      type: String,
      default: '&'
    }
  },
  data() {
    return {
      pwd: '', // 密码明文
      inputEl: null, // input元素
      isComposing: false, // 输入框是否还在输入（记录输入框输入的是虚拟文本还是已确定的文本）
      focused: false // 是否需要显示清空
    }
  },
  computed: {
    // 什么情况下可以清空和出现清空
    showClearable() {
      return this.clearable && !this.disabled && !this.readonly && this.focused && this.pwd.length !== 0
    },
    // 获取表单项中的尺寸
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    // 优先使用当前节点的尺寸，没有则使用表单中定义的尺寸
    inputSize() {
      return this.$attrs.size || this._elFormItemSize || (Cookies.get('size') || 'mini')
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        // 过滤汉字
        this.pwd = val.replace(/[\u4e00-\u9fa5]/g, '')
        this.$nextTick(() => {
          if (this._inputEl) {
            this._inputEl.value = this.pwd
            !this.showPassword && this.inputDataConversion(this.pwd)
            if (this.validateEvent) {
              this.$parent.$emit('el.form.change', [val])
            }
          }
        })
      }
    },
    showPassword: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.inputEl.value = this.pwd
            return
          } else {
            this.inputDataConversion(this.pwd)
          }
        })
      }
    }
  },
  mounted() {
    this.$refs.input.blur()
    this.inputEl = this.$refs.input
  },
  created() {},
  methods: {
    // 输入框里的数据转换，将123换成****
    inputDataConversion(value) {
      this.inputEl = this.$refs.input
      if (this.inputEl && !value) {
        this.inputEl.value = ''
        return
      }
      let data = ''
      // 过滤中文
      const filtersZhHaractters = value.replace(/[\u4e00-\u9fa5]/g, '')
      for (let i = 0; i < filtersZhHaractters.length; i++) {
        data += this.replaceSymbol
      }
      this.inputEl.value = data
    },
    // 写入原始数据
    pwdSetData(positionIndex, value) {
      const _pwd = value.split(this.replaceSymbol).join('')
      if (_pwd) {
        const index = this.pwd.length - (value.length - positionIndex.end)
        this.pwd = this.pwd.slice(0, positionIndex.end - _pwd.length) + _pwd + this.pwd.slice(index)
      } else {
        this.pwd = this.pwd.slice(0, positionIndex.end) + this.pwd.slice(positionIndex.end + this.pwd.length - value.length)
      }
    },
    handleInput(e) {
      // 输入值变化后执行
      // 写期间不应该发出输入
      window.event ? window.event.cancelBubble = true : e.stopPropafation()
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        window.event.returnValue === false
      }
      // 写期间不应该发出输入
      if (this.isComposing) return
      const cursorPosition = new CursorPosition(this.inputEl)
      const positionsIndex = cursorPosition.get()
      const value = e.target.value.replace(/[\u4e00-\u9fa5]/g, '')
      if (this.showPassword) {
        this.inputEl.value = value
        this.pwd = value
      } else {
        this.pwdSetData(positionsIndex, value)
        this.inputDataConversion(value)
      }
      this.$emit('input', this.pwd)
    },
    handleCompositionStart() {
      // 表示正在写
      this.isComposing = true
    },
    handleCompositionEnd(e) {
      console.log(e)
      if (this.isComposing) {
        this.isComposing = false
        // handleCompositionEnd比handleInput后执行，避免isComposing还为true时handleInput无法执行正确的逻辑
        this.handleInput(e)
      }
    },
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focused = false
      if (this.validateEvent) {
        this.$parent.$emit('el.form.blur', [this.pwd])
      }
      this.$emit('blur', event)
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    // 清空事件
    clear() {
      this.inputEl.value = ''
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
    },
    // focus事件，给外部使用
    focus(...args) {
      const { input } = this.$refs
      input['focus'](...args)
    },
    // blur事件，给外部使用
    blur(...args) {
      const { input } = this.$refs
      input['blur'](...args)
    }
  }
}
</script>
<style lang='scss' scoped></style>
