export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    ALL_PROTOCOLS () {
        return request({
            url: 'systemConfig/protocols/all',
            method: 'get'
        })
    }
})