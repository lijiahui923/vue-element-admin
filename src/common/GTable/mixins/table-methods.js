const METHODS_NAMES = [
  'clearSelection',
  'toggleRowSelection',
  'toggleAllSelection',
  'toggleRowExpansion',
  'setCurrentRow',
  'clearSort',
  'clearFilter',
  'doLayout',
  'sort'
]

const methods = {}
METHODS_NAMES.forEach(name => {
  methods[name] = function(...args) {
    const ref_mTable = this.$refs[this.elTableRef]
    if (ref_mTable && ref_mTable[name]) {
      ref_mTable[name](...args)
    }
  }
})

export default { methods }
