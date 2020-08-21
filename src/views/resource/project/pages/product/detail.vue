<template>
  <d2-container class="producct-detail-container">
      <div class="product-wrapper">
        <div class="box product-box"  v-loading='detail.loading'>
            <!-- <div class="title">产品信息</div> -->
            <div class="list detail-box">
                <div class="item device-count">
                    <div class="title">设备数量</div>
                    <div class="content">{{ detail.data.deviceCount?detail.data.deviceCount:0}}</div>
                </div>
                <div class="meta-box">
                    <div class="item">
                        <div class="title">产品名称:</div>
                        <div class="content">{{detail.data.name}}</div>
                    </div>
                    <div class="item">
                        <div class="title">产品类型:</div>
                        <div class="content">{{detail.data.type==1?'通用':'未知'}}</div>
                    </div>
                    <div class="item">
                        <div class="title">产品协议:</div>
                        <div class="content">{{protoToStr(detail.data.protocol)}}</div>
                    </div>
                    <div class="item">
                        <div class="title">创建时间:</div>
                        <div class="content">{{detail.data.createTime}}</div>
                    </div>
                    <!-- <div class="item tags">
                        <div class="title">产品标签:</div>
                        <div class="content tag-list">
                            <span class='tag'
                            v-for="(tag,i) in detail.data.tags"
                            :key="'tag'+i">{{tag}}</span>
                        </div>
                    </div> -->
                    <div class="item">
                        <div class="title">产品描述:</div>
                        <div class="content">{{detail.data.description}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box protocol-box" v-if="protocol.data&&protocol.data.length>0">
            <div class="title">接入点</div>
            <el-tabs class="protocol-tabs" :value='protocol.data[0].name'>
                <el-tab-pane v-for="(p,index) in  protocol.data" :key="'protocol'+index" :label="p.label" :name="p.name">
                    <el-table v-if="protocol.list[p.name]" :data='protocol.list[p.name].list'>
                        <el-table-column v-for="(item,i ) in protocol.list[p.name].cols"
                            :key="'item'+i" :prop="item.name" :label="item.label">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="expand-box">
            <div class="box param-box" v-loading='detail.loading'>
                <div class="wrapper param">
                    <div class="title">产品参数</div>
                    <div class="list param-list">
                        <el-table :data="detail.data.parameters" size='medium'  max-height='100%'>
                            <el-table-column prop="field" label="字段" >
                            </el-table-column>
                            <el-table-column label="类型" >
                                <template slot-scope="scope"> {{typeToStr(scope.row.type)}}</template>
                            </el-table-column>
                            <el-table-column prop="defaultValue" label="默认值" ></el-table-column>
                            <el-table-column prop="description" label="描述"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="box module-box"  v-loading='module.loading'>
                <div class="wrapper">
                    <div class="title">模块信息</div>
                    <div class="list module-list">
                        <el-table class="module-table" :data="module.data" max-height='100%'>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <el-table class="module-table" :data="props.row.dataAreas">
                                        <el-table-column prop="field" label="字段" ></el-table-column>
                                        <el-table-column label="类型" >
                                            <template slot-scope="scope"> {{typeToStr(scope.row.type)}}</template>
                                        </el-table-column>
                                        <el-table-column prop="defaultValue" label="默认值" ></el-table-column>
                                        <el-table-column prop="description" label="描述"></el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>
                            <el-table-column prop="field" label="图标">
                                <template slot-scope="scope"><img class="icon" :src="scope.row.icon" alt="icon"/></template> 
                            </el-table-column>
                            <el-table-column prop="name" label="类型"></el-table-column>
                            <el-table-column prop="description" label="描述"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>  
      </div>
  </d2-container>
</template>

<script>
import { ProtoToStr, FieldTypeToStr } from '@/libs/const'
export default {
  name: 'producct-detail',
  data () {
    return {
      id: 0,
      detail: {
        data:{},
        loading: false,
      },
      module: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
        loading: false,
      },
      protocol:{
        data:{},
        list: {
            'MQTT':{
                cols:[{
                    name: 'name',
                    label: '名称'
                },{
                    name: 'value',
                    label: '值',
                }],
                list:[{
                    name: '数据上行',
                    value: '/ota/device/upgrade/a1LvegVTVfm/${deviceName}',
                },{
                    name: '数据下行',
                    value: '/ota/device/upgrade/a1LvegVTVfm/${deviceName}',
                },{
                    name: '日志',
                    value: '/ota/device/upgrade/a1LvegVTVfm/${deviceName}',
                }]
            },
            'HTTP':{
                cols: [{
                        name: 'name',
                        label: '名称'
                    },{
                        name: 'url',
                        label: 'URL',
                    },{
                        name: 'method',
                        label: 'HTTP方法',
                    }, {
                        name: 'url',
                        label: 'HEAD',
                    }],
                list: [{
                    name: '上行数据',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'POST',
                    head: 'token:{token}',
                },{
                    name: '上行日志',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'POST',
                    head: 'token:{token}',
                },{
                    name: '时钟同步',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'GET',
                    head: 'token:{token}',
                }],
            },
            'COAP':{
                cols:[{
                    name: 'name',
                    label: '名称'
                },{
                    name: 'url',
                    label: 'URL',
                },{
                    name: 'method',
                    label: 'HTTP方法',
                }, {
                    name: 'url',
                    label: 'HEAD',
                }],
                list:[{
                    name: '上行数据',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'POST',
                    head: 'token:{token}',
                },{
                    name: '上行日志',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'POST',
                    head: 'token:{token}',
                },{
                    name: '时钟同步',
                    url: 'https://www.aliyun.com/product/iot-devi',
                    method: 'GET',
                    head: 'token:{token}',
                }]
            }
        },
        loading: false,
      }
    }
  },
  mounted () {
    this.id = this.$route.params.productId
    this.getProduct()
    this.getModule()
    this.getProtocol()
  },
  methods: {
    typeToStr (index) {
      return FieldTypeToStr(index)
    },
    protoToStr (index) {
      return ProtoToStr(index)
    },
    getProduct () {
      const that = this
        that.detail.loading = true
      this.$api.PRODUCT_INFO(this.id).then(res => {
        that.detail.data = res
        console.log(that.detail)
        that.detail.loading = false
      }).catch(err=>{
        that.detail.loading = false
      })
    },
    getModule () {
      const that = this
      const params = {
        productId: this.id,
        current: that.module.current,
        size: that.module.size
      }
      that.module.loading = true
      this.$api.MODULE_LIST(params).then(res => {
        this.module.data = res.records
        this.module.total = res.total
        that.module.loading = false
      }).catch(err=>{
          console.log(err)
        that.module.loading = false
      })
    },
    getProtocol() {
        const that = this
        that.protocol.loading = true
        that.$api.ALL_PROTOCOLS().then(res => {
            that.protocol.data = res
            that.protocol.loading = false
        }).catch(err=>{
          console.log(err)
            that.protocol.loading = false
      })
    }
  }
}
</script>

<style lang='scss'>
.producct-detail-container{
    .product-wrapper{
        height: 100%;
        // display: flex;
        flex-flow: column;
        .box{
            // width: 60%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            &>.title{
                color: rgba(0,0,0,.65);
                font-weight: 700;
                font-size: 16px;
                line-height: 1.5715;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            &>.list{
                margin-top: 10px;
                font-size: 14px; 
            }
        }
        .product-box{
            padding: 24px;
            height: 80px;
            .detail-box{
                display: flex;
                .device-count{
                    width: 80px;
                    text-align: center;
                    border-right: 1px solid #ddd;
                    margin-right: 30px;
                    // margin-right: 20px;
                    // padding: 10px 0;
                    padding-right: 20px;
                    .title{
                        font-weight: 700;
                        color: #666;
                    }
                    .content{
                        color: rgba(0, 0, 0, 0.65);
                        margin-top: 10px;
                        font-size: 28px;
                    }
                }
                .meta-box{
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    .item{
                        // margin-right: 50px;
                        margin-bottom: 18px;
                        line-height: 20px;
                        width: 25%;
                        .title{
                            margin-right: 10px;
                            width: 70px;
                            float: left;
                            color: rgba(0, 0, 0, 0.85);
                        }
                        .content {
                            word-wrap:break-word;
                            word-break:break-all;
                            overflow: hidden;
                            color: rgba(0, 0, 0, 0.65);
                        }
                    }
                    // .tags{
                    //     .tag-list{
                    //         display: flex;
                    //         flex-wrap: wrap;    
                    //         .tag{
                    //             margin-bottom: 4px;
                    //             padding: 0 4px;
                    //             margin-right: 6px;
                    //             border: 1px solid #ccc;
                    //             color: rgba(0, 0, 0, 0.65);
                    //             background-color: #FAFAFA;
                    //         }
                    //     }
                    // }
                }

            }
        }
        .protocol-box{
            margin-top: 20px;
            min-height: 120px;
            padding: 20px;
            .title{
                line-height: 20px;
                width: 80px;
                color: rgba(0,0,0,.65);
                font-weight: 700;
            }
            .protocol-tabs{
            }
        }
        .expand-box{
            margin-top: 20px;
            // height: 100%;
            // flex: 1;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .wrapper{
                padding: 24px;
            }
            .param-box{
                width: 58%;
                // padding-right: 20px;
                // margin-right: 40px;
                .title{
                    line-height: 20px;
                    width: 80px;
                    color: rgba(0,0,0,.65);
                    font-weight: 700;
                }
                .param-list{
                    margin-top: 10px;
                    word-break: break-all;
                    overflow: hidden;
                    font-size: 16px;
                    .el-table{
                        font-size: 16px; 
                    }
                }
            }
            .module-box{
                // margin-top: 30px;
                width: 40%;
                .title{
                    color: rgba(0,0,0,.65);
                    font-weight: 700;
                }
                .module-list{
                    margin-top: 10px;
                    .module-table{
                        .icon{
                            width: 25px;
                            height: 25px;
                        }
                    }
                }
            }
        }
    }
}
</style>
