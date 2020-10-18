// 功能相关接口

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  FEATURE_INFO (id) {
    return request({
      url: 'features/' + id,
      method: 'get'
    })
  },
  FEATURE_CREATE (data) {
    return request({
      url: 'features',
      method: 'post',
      data
    })
  },
  FEATURE_DELETE (ids) {
    return request({
      url: 'features/' + ids.join(', '),
      method: 'delete'
    })
  },
  FEATURE_UPDATE (id, data) {
    return request({
      url: 'features/' + id,
      method: 'put',
      data
    })
  }
})
