export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    // 所有协议
    CAPTCHA () {
        return request({
            url: '/captcha',
            method: 'get'
        })
    }
})