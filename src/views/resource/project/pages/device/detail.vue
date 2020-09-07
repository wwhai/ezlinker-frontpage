<template>
    <d2-container class="device-detail-container">
        <el-card class="box-card" >
            <el-page-header slot="header" @back="goBack" :content='pageTitle'/>
            <div class="meta" v-loading='device.loading'>
                <div class="logo">
                    <img :src="device.data.logo" />
                </div>
                <div class="info">
                    <div class="item">
                        <div class="label">设备SN</div>
                        <div class="value">{{device.data.sn}}</div>
                    </div>
                    <div class="item">
                        <div class="label">设备名称</div>
                        <div class="value">{{device.data.name}}</div>
                    </div>
                    <div class="item">
                        <div class="label">设备型号</div>
                        <div class="value">{{device.data.model}}</div>
                    </div>
                    <div class="item">
                        <div class="label">生产厂家</div>
                        <div class="value">{{device.data.industry}}</div>
                    </div>
                    <div class="item">
                        <div class="label">当前状态</div>
                        <div class="value">
                            <el-tag v-if="device.data.state == 1" type="success">在线</el-tag>
                            <el-tag v-else type="warning">离线</el-tag>
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">创建日期</div>
                        <div class="value">{{device.data.createTime}}</div>
                    </div>
                </div>
            </div>
        </el-card>
        <!-- <el-card class="box-card">
        </el-card> -->
    </d2-container>
</template>

<script>
export default {
    name: 'device-detail',
    data(){
        return {
            pageTitle: '设备详情',
            id: 0, // deviceId
            device: {
                data: {},
                loading: false,
            },
        }
    },
    mounted(){
        this.id = this.$route.params.deviceId;
        this.getDeviceInfo()
    },
    methods: {
        goBack(){
            this.$router.go(-1)
        },
        getDeviceInfo(){
            this.device.loading = true
            this.$api.DEVICE_INFO(this.id)
                .then(res=>{
                    this.device.data = res
                    this.device.loading = false
                })
                .catch(err=>{
                    console.log(err)
                    this.device.loading = false
                })
        }
    },
}
</script>

<style lang='scss'>
.device-detail-container{
    .box-card + .box-card{
        margin-top: 20px;
    }
    .meta{
        display: flex;
        .logo{
            width: 100px;
            height: 100px;
            padding-right: 20px;
            img{
                width: 100%;
            }
        }
        .info{
            width: 100%;
            display: flex;  
            flex-wrap: wrap;
            line-height: 30px;
            .item{
                width: 25%;
                display: flex;
                .label{
                    padding-right: 4px;
                    &::after{
                        content: ':';    
                    }
                }
                .value{
                    word-break: break-all;
                }
            }
        }
    }
}
</style>