
export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  MODULE_TYPE_ALL () {
    return request({
      url: 'systemConfig/moduleType/all',
      method: 'get'
    })
  }
})
