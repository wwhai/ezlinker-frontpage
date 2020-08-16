<template>
  <d2-container class="producct-detail-container">
      <div class="product-box">
          <div class="title">产品信息</div>
          <el-divider></el-divider>
          <div class="detail-box">
              <div class="left">
                  <div class="item">
                    <div class="title">产品名称:</div>
                    <div class="content">{{detail.name}}</div>
                  </div>
                  <div class="item">
                    <div class="title">产品类型:</div>
                    <div class="content">{{detail.type==1?'通用':'未知'}}</div>
                  </div>
                  <div class="item tags">
                    <div class="title">产品标签:</div>
                    <div class="content tag-list">
                        <span class='tag' 
                        v-for="(tag,i) in detail.tags" 
                        :key="'tag'+i">{{tag}}</span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="title">产品描述:</div>
                    <div class="content">{{detail.description}}</div>
                  </div>
                  <div class="item">
                    <div class="title">产品协议:</div>
                    <div class="content">{{protoToStr(detail.protocol)}}</div>
                  </div>
                  <div class="item">
                    <div class="title">创建时间:</div>
                    <div class="content">{{detail.createTime}}</div>
                  </div>
              </div>
              <div class="right" v-if="detail.parameters&&detail.parameters.length>0">
                  <div class="title">产品参数:</div>
                    <div class="param-list">
                        <div class="param">
                            <span class="p field">字段</span>
                            <span class="p type">类型</span>
                            <span class="p default">默认</span>
                            <span class="p desc">描述</span>
                        </div>
                        <div class="param" v-for="(param, i) in detail.parameters" :key="'param'+i">
                            <span class="p field">{{param.field}}</span>
                            <span class="p type">{{typeToStr(param.type)}}</span>
                            <span class="p default">{{param.defaultValue}}</span>
                            <span class="p desc">{{param.description}}</span>                      
                        </div>
                   </div>
              </div>
          </div>
      </div>
      <div class="module-box" v-if="module.data&&module.data.length>0">
        <div class="title">模块信息</div>
        <el-divider></el-divider>
        <div class="module-list">
            <div class="item" v-for="(v,k) in module.data" :key="'moduleTemp'+k">
                <div class="meta-box">
                    <div class="icon-box"><img :src="v.icon"/></div>
                    <div class="meta">
                        <div class="title">{{v.name}}</div>
                        <div class="desc">{{v.description}}</div>
                    </div>
                </div>
                <div class="param-list" v-if="v.dataAreas&&v.dataAreas.length>0">
                    <div class="param" v-for="(d, i) in v.dataAreas" :key="k+'param'+i">
                        <span class="field">{{d.field}}</span>
                        <span class="type">{{typeToStr(d.type)}}</span>
                        <span class="default">{{d.defaultValue}}</span>
                        <span class="desc">{{d.description}}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
  </d2-container>
</template>

<script>
import {ProtoToStr, FieldTypeToStr} from '@/libs/const'
export default {
    name: 'producct-detail',
    data(){
        return {
            id: 0,
            detail: {},
            module:{
                data:[],
                current: 1,
                size: 10,
                total: 0,
            }
        }
    },
    mounted(){
        this.id = this.$route.params.productId
        this.getProduct()
        this.getModule()
    },
    methods:{
        typeToStr(index){
            return FieldTypeToStr(index)
        },
        protoToStr(index){
            return ProtoToStr(index)
        },
        getProduct(){
            const that = this
            this.$api.PRODUCT_INFO(this.id).then(res=>{
                that.detail = res
                console.log(that.detail)
            })
        },
        getModule(){
            const that = this
            const params = {
                productId: this.id,
                current: that.module.current,
                size: that.module.size
            }
            this.$api.MODULE_LIST(params).then(res=>{
                this.module.data = res.records
                this.module.total = res.total
            })
        }
    }
}
</script>

<style lang='scss'>
.producct-detail-container{
    .product-box{
        .detail-box{
            display: flex;
            .left{
                width: 40%;
                .item{
                    // display: flex;
                    margin-bottom: 10px;
                    line-height: 20px;
                    
                    .title{
                        margin-right: 10px;
                        width: 80px;
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
                        .tag{
                            padding: 0 4px;
                            margin-right: 6px;
                            border: 1px solid #ccc;
                            color: rgba(0, 0, 0, 0.65);
                            background-color: #FAFAFA;
                        }
                    }
                }
            }
            .right{
                width: 60%;
                .title{
                    line-height: 20px;
                    float: left;
                    width: 80px;
                }
                .param-list{
                    word-break: break-all;
                    overflow: hidden;
                    border-top: 1px solid rgba(0, 0, 0, 0.25);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
                    width: 300px;
                    .param{
                        line-height: 20px;
                        padding: 6px 0;
                        .p{
                            display: inline-block;
                            // padding: 0 10px;
                            text-align: center;
                        }
                        .p + .p{

                        }
                        .field{
                            width: 80px;
                        }
                        .type {
                            width: 80px;
                        }
                        .default{
                            width: 40px;
                        }
                        .desc{
                            min-width: 100px;
                        }
                    }
                    .param + .param{
                        
                        border-top: 1px solid rgba(0, 0, 0, 0.25);
                    
                    }
                }
            }
        }
    }
    .module-box{
        margin-top: 30px;
        .module-list{
            // padding: 0 20px;
            display: flex;
            .item{
                text-align: center;
                // display: flex;
                justify-content: space-between;
                margin-top: 20px;
                margin-right: 20px;
                width: 200px;
                border: 1px solid rgba(0, 0, 0, 0.15);
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                &:hover{
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                }
                .meta-box{
                    padding: 10px 8px;
                    display: flex;
                    .icon-box{
                        width: 35px;
                        height: 35px;
                        border-radius: 5px;
                        margin-right: 10px;
                        border: 1px solid rgba(0, 0, 0, 0.25);
                        img{
                        width: 100%;
                        }
                    }
                    .meta{
                        max-width: 136px;

                        text-align: left;
                        .title{
                            color: rgba(0, 0, 0, 0.65);
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .desc{
                            color: rgba(0, 0, 0, 0.45);
                            font-size: 14px;
                            overflow: hidden;
                            white-space: nowrap;
                             display: -webkit-box;
                        }
                    }
                }
                .param-list{
                    text-align: center;
                    border-top: 1px solid rgba(17, 16, 16, 0.25);
                    .param{
                        line-height: 34px;
                        font-size: 14px;
                        color: #333;
                        display: flex;
                        justify-content: space-between;
                        text-align: center;
                        span{
                            padding: 0 6px
                        }
                        span + span{
                            margin-left: -1px;
                            border-left: 1px solid rgba(0, 0, 0, 0.25);
                        }
                    }
                    .param + .param{
                        border-top: 1px solid rgba(17, 16, 16, 0.25);
                    }
                }
            }
            .item + .item{
                margin-top: 20px;
            }
            .add-btn{
                height: 36px;
                line-height: 38px;
                box-shadow: 0;
                border: 1px dashed #999;
                color: #555;
                display: block;
                text-align: center;
                cursor: pointer;
                &:hover{
                border-color: #333;
                color: #333;
                }
                .fa{
                margin-right: 8px;
                }
            }
        }
    }
    .el-divider{
        margin-bottom: 12px;
    }
}
</style>