export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    CLOUDFUNC_INFO(id){
        return request({
            url:'cloudFunctions/'+id,
            method: 'get',
        })
    },
    CLOUDFUNC_LIST(params){
        return request({
            url:'cloudFunctions',
            method: 'get',
            params
        })
    },
    CLOUDFUNC_CREATE(data){
        return request({
            url:'cloudFunctions',
            method: 'post',
            data
        })
    },
})