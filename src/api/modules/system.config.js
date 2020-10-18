export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    // 所有协议
    ALL_PROTOCOLS () {
        return request({
            url: 'systemConfig/protocols/all',
            method: 'get'
        })
    },
    // 所有接入点信息
    ALL_ENTRY_POINTS () {
        return request({
            url: '/systemConfig/entryPoints/all',
            method: 'get'
        })
    }
})