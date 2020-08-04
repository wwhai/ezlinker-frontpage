// export const state = () => ({

// })

// export const mutations = {

// }

export default {
  namespaced: true,
  state: {
    error: {
      text: ''
    }
  },
  actions: {
    error (state, error) {
      state.error = error
    }
  }
}
