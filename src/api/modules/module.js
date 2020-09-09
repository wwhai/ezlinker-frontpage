// 功能相关接口

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    MODULE_INFO (id) {
      return request({
        url: 'modules/' + id,
        method: 'get'
      })
    },
    MODULE_CREATE (data) {
      return request({
        url: 'modules',
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
    MODULE_UPDATE (id, data) {
      return request({
        url: 'modules/' + id,
        method: 'put',
        data
      })
    },
    MODULE_QUERY_FOR_PAGE (params) {
        return request({
          url: 'modules/',
          method: 'get',
          params
        })
    },
    MODULE_LOG(params){
      return request({
        url: 'modules/logs',
        method: 'get',
        params,
      })
    },
    MODULE_STATUS(projectId, moduleIds){
      return request({
        url: 'modules/'+moduleIds.join(',')+'/'+projectId+'/status',
        method: 'get',        
      })
    },
  })
  