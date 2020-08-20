<template>
  <d2-container class="producct-detail-container">
      <div class="product-wrapper">
        <div class="box product-box"  v-loading='detail.loading'>
            <div class="title">产品信息</div>
            <div class="list detail-box">
                <div class="meta-box">
                    <div class="item">
                        <div class="title">产品名称:</div>
                        <div class="content">{{detail.data.name}}</div>
                    </div>
                    <div class="item">
                        <div class="title">产品类型:</div>
                        <div class="content">{{detail.data.type==1?'通用':'未知'}}</div>
                    </div>
                    <div class="item tags">
                        <div class="title">产品标签:</div>
                        <div class="content tag-list">
                            <span class='tag'
                            v-for="(tag,i) in detail.data.tags"
                            :key="'tag'+i">{{tag}}</span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">产品描述:</div>
                        <div class="content">{{detail.data.description}}</div>
                    </div>
                    <div class="item">
                        <div class="title">产品协议:</div>
                        <div class="content">{{protoToStr(detail.data.protocol)}}</div>
                    </div>
                    <div class="item">
                        <div class="title">创建时间:</div>
                        <div class="content">{{detail.data.createTime}}</div>
                    </div>
                </div>
            </div>
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
      }
    }
  },
  mounted () {
    this.id = this.$route.params.productId
    this.getProduct()
    this.getModule()
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
    }
  }
}
</script>

<style lang='scss'>
.producct-detail-container{
    .product-wrapper{
        height: 100%;
        display: flex;
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
            height: 140px;
            .detail-box{
                .meta-box{
                    display: flex;
                    flex-wrap: wrap;
                    .item{
                        // margin-right: 50px;
                        margin-bottom: 10px;
                        line-height: 20px;
                        width: 25%;
                        .title{
                            margin-right: 10px;
                            width: 70px;
                            float: left;
                        }
                        .content {
                            word-wrap:break-word;
                            word-break:break-all;
                            overflow: hidden;
                        }
                    }
                    .tags{
                        .tag-list{
                            display: flex;
                            flex-wrap: wrap;    
                            .tag{
                                margin-bottom: 4px;
                                padding: 0 4px;
                                margin-right: 6px;
                                border: 1px solid #ccc;
                                color: rgba(0, 0, 0, 0.65);
                                background-color: #FAFAFA;
                            }
                        }
                    }
                }

            }
        }
        .expand-box{
            margin-top: 20px;
            height: 100%;
            flex: 1;
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
