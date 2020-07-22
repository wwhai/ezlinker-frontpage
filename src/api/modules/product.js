// 产品管理相关接口

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  PRODUCT_INFO (id) {
    return request({
      url: 'products/' + id,
      method: 'get'
    })
  },
  PRODUCT_LIST (params) {
    return request({
      url: 'products',
      method: 'get',
      params
    })
  },
  PRODUCT_CREATE (data) {
    return request({
      url: 'products',
      method: 'post',
      data
    })
  },
  PRODUCT_DELETE (ids) {
    return request({
      url: 'products/' + ids.join(', '),
      method: 'delete'
    })
  },
  PRODUCT_UPDATE (id, data) {
    return request({
      url: 'products/' + id,
      method: 'put',
      data
    })
  }
})
