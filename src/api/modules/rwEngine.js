export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    RWENGINE_INFO (params) {
      return request({
        url: 'rwengines',
        method: 'get',
        params
      })
    },
    RWENGINE_CREATE (data) {
      return request({
        url: 'rwengines',
        method: 'post',
        data
      })
    },
    RWENGINE_DELETE (ids) {
      return request({
        url: 'rwengines/'+ids.join(','),
        method: 'delete',
      })
    },
    RWENGINE_QUERY_FOR_PAGE (params) {
        return request({
          url: 'rwengines/queryForPage',
          method: 'get',
          params
        })
      }
  })
  