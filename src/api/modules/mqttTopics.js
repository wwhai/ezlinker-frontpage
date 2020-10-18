export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    TOPICS (params) {
        return request({
            url: 'mqttTopics',
            method: 'get',
            params
        })
    }
})