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
        params: params
      })
    },
    DEVICE_CREATE (data) {
      return request({
        url: 'devices',
        method: 'post',
        data
      })
    },
    REMOVE_DEVICE (ids) {
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
    },
    // 设备的日志
    DEVICE_LOGS (params) {
      return request({
        url: 'devices/deviceLogs',
        method: 'get',
        params
      })
    },
    // 设备的日志
    DEVICE_ONLINE_STATE (data) {
      return request({
        url: 'devices/onlineState',
        method: 'post',
        data
      })
    },
      // 设备的日志
    FORCE_OFFLINE (clientId) {
        return request({
          url: 'devices/forceOffline?clientId=' + clientId,
          method: 'delete'
        })
    },
    DEVICE_DATA (params) {
      return request({
        url: 'devices/deviceData',
        method: 'get',
        params
      })
    },
    DEVICE_STATE (clientId,current,size,fields) {
      return request({
        url: 'devices/deviceState?current=' + current + "&size=" + size + "&clientId=" + clientId + "&fields=" + fields.join(","),
        method: 'get',
      })
    },
    // 下载
    DOWNLOAD_AUTH_FILE (clientId) {
      return request({
        url: 'devices/downloadAuthFile',
        responseType: 'blob',
        method: 'get',
        params:{clientId : clientId}
      })
    }
  })
  