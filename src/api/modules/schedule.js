export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  SCHEDULE_INFO (params) {
    return request({
      url: 'scheduleInfos',
      method: 'get',
      params
    })
  },
  SCHEDULE_CREATE (data) {
    return request({
      url: 'scheduleInfos',
      method: 'post',
      data
    })
  },
  SCHEDULE_DELETE (ids) {
    return request({
      url: 'scheduleInfos/'+ids.join(','),
      method: 'delete',
    })
  },
  SCHEDULE_QUERY_FOR_PAGE (params) {
    return request({
      url: 'scheduleInfos/',
      method: 'get',
      params: params
    })
  },
})
