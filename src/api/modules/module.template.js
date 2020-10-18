// 产品模块相关接口

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  MODULE_INFO (id) {
    return request({
      url: 'modules/' + id,
      method: 'get'
    })
  },
  MODULE_LIST (params) {
    return request({
      url: 'moduleTemplates',
      method: 'get',
      params
    })
  },
  MODULE_TEMPLATE_CREATE (data) {
    return request({
      url: 'moduleTemplates',
      method: 'post',
      data
    })
  },
  MODULE_DELETE (ids) {
    return request({
      url: 'modules/' + ids.join(', '),
      method: 'delete'
    })
  },
  MODULE_TEMPLATE_UPDATE (id, data) {
    return request({
      url: 'moduleTemplates/' + id,
      method: 'put',
      data
    })
  },
  MODULE_LOGS (params) {
    return request({
      url: 'modules/logs',
      method: 'get',
      params
    })
  }
})
