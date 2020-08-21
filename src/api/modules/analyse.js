
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  OVER_VIEW () {
    return request({
      url: 'bizAnalyse/overView',
      method: 'get'
    })
  },
  EZLINKER_INFO () {
    return request({
      url: '/monitor/ezlinker/info',
      method: 'get'
    })
  },
  EMQX_ALL (params) {
    return request({
      url: 'monitor/emqx/all',
      method: 'get',
      params
    })
  },
  OS_RUNING (params) {
    return request({
      url: 'monitor/os/running24h',
      method: 'get',
      params
    })
  },
  NETWORK_RUNNING () {
    return request({
      url: '/monitor/network/running24h',
      method: 'get'
    })
  }
})
