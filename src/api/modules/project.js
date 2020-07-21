//项目管理相关api

export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    PROJECT_INFO(id){
        return  request({
            url: 'projects/' + id,
            method: 'get'
        })
    },
    PROJECT_ICON(){
        return request({
            url: 'projects/icons',
            method: 'get'
        })
    },
    PROJECT_LIST(params){
        return request({
            url: 'projects/icons',
            method: 'get',
            params
        })
    },
    PROJECT_CREATE(data){
        return request({
            url: 'projects',
            method: 'post',
            data
        })
    },
    PROJECT_UPDATE(id,data){
        return  request({
            url: 'projects/' + id,
            method: 'put',
            data
        })
    },
    PROJECT_DELETE(ids){
        return  request({
            url: 'projects/' + ids.join(', '),
            method: 'delete',
        })
    }
})