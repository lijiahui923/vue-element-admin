const state = {
  mainBodyH: '',
  mainBodyW: ''
}

const mutations = {
  // 浏览器发生窗口改变
  CLIENT_RESIZE: (state, payload) => {
    state.mainBodyH = payload.mainBodyH
    state.mainBodyW = payload.mainBodyW
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
