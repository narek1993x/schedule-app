export default {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    setLoading({
      commit
    }, payload) {
      commit('setLoading', payload)
    }
  },
  getters: {
    loading(state) {
      return state.loading
    }
  }
}
