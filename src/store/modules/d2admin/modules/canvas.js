// export const state = () => ({
//   data: {
//     scale: 1,
//     lineName: 'curve',
//     fromArrowType: '',
//     toArrowType: 'triangleSolid',
//     locked: 0
//   }
// })

// export const mutations = {
//   data(state, data) {
//     state.data = data
//   }
// }

export default {
  namespaced: true,
  state: {
    data: {
      scale: 1,
      lineName: 'curve',
      fromArrowType: '',
      toArrowType: 'triangleSolid',
      locked: 0
    }
  },
  actions: {
    data (state, data) {
      state.data = data
    }
  }
}
