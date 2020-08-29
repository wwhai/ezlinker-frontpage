// 功能相关接口

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    DEVICE_INFO (id) {
      return request({
        url: 'devices/' + id,
        method: 'get'
      })
    },
    DEVICE_QUERY_FOR_PAGE (params) {
      return request({
        url: 'devices/',
        method: 'get',
        params
      })
    },
    DEVICE_CREATE (data) {
      return request({
        url: 'devices',
        method: 'post',
        data
      })
    },
    DEVICE_DELETE (ids) {
      return request({
        url: 'devices/' + ids.join(', '),
        method: 'delete'
      })
    },
    DEVICE_UPDATE (id, data) {
      return request({
        url: 'devices/' + id,
        method: 'put',
        data
      })
    }
  })
  