const localCache = {
  setItem: (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key))
  }
}

const VISIBLE_COLUMNS_KEY = 'VISIBLE_COLUMNS'
const COLUMNS_WIDTH_KEY = 'COLUMNS_WIDTH'

const storageColumn = {
  methods: {
    storageVisibleColumns(visibleProps) {
      const key = `${this.keyId}${VISIBLE_COLUMNS_KEY}`
      localCache.setItem(key, visibleProps)
    },
    getStorageVisibleColumns() {
      const key = `${this.keyId}${VISIBLE_COLUMNS_KEY}`
      return localCache.getItem(key)
    },
    storageColumnsWidth(propsWidth) {
      const storage = this.getStorageColumnsWidth()
      Object.assign(storage, propsWidth)
      const key = `${this.keyId}${COLUMNS_WIDTH_KEY}`
      localCache.setItem(key, storage)
    },
    getStorageColumnsWidth() {
      const key = `${this.keyId}${COLUMNS_WIDTH_KEY}`
      return localCache.getItem(key) || {}
    }
  }
}

export default storageColumn
