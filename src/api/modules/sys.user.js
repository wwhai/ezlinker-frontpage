// import { find, assign } from 'lodash'

// const users = [
//   { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: 'Admin' },
//   { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: 'Editor' },
//   { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: 'User1' }
// ]

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  USER_LOGIN (data) {
    return request({
      url: '/entry/login',
      method: 'post',
      data
    })
  },
  USER_INFO () {
    return request({
      url: '/users/userInfo',
      method: 'get'
    })
  },
  UPDATE_USER_INFO (data) {
    return request({
      url: '/users/info',
      method: 'put',
      data
    })
  },
  UPDATE_PWD (data) {
    return request({
      url: '/users/resetPassword',
      method: 'put',
      data
    })
  },

  USER_LOG (params) {
    return request({
      url: 'userLogs',
      method: 'get',
      params
    })
  }
})
