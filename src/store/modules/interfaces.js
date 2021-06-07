const state = {
  // 正在请求的接口集合
  interfacesUnderWay: []
}

const mutations = {
  // 添加正在请求的接口信息
  ADD_INTERFACE: (state, data) => {
    state.interfacesUnderWay.push(data)
  },
  REMOVE_INTERFACE: (state, data) => {
    const index = state.interfacesUnderWay.indexOf(data)
    if (index !== -1) {
      state.interfacesUnderWay.splice(index, 1)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
