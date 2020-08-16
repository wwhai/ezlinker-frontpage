// export const state = () => ({
//   event: {
//     name: '',
//     data: null
//   }
// })

// export const mutations = {
//   emit(state, event) {
//     state.event = event
//   }
// }

export default {
  namespaced: true,
  state: {
    event: {
      name: '',
      data: null
    }
  },
  actions: {
    emit (state, event) {
      state.event = event
    }
  }
}
