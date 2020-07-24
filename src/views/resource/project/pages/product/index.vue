<template>
  <d2-container class="product-container">
    <!-- 统计信息 -->
    <div class="stat">
      <div class="item">
        <div class="title">全部产品</div>
        <div class="count">6</div>
      </div>
      <div class="item">
        <div class="title">开发中</div>
        <div class="count">1</div>
      </div>
      <div class="item">
        <div class="title">运行中</div>
        <div class="count">2</div>
      </div>
      <div class="item">
        <div class="title">已锁定</div>
        <div class="count">3</div>
      </div>
    </div>
    <!-- 产品列表 -->
    <div class="list-box">
      <div class="list-head">
        <div class="title">产品列表</div>
        <div class="right">
          <span class="type-list">
            <span class="" data-type='0'>全部产品</span>
            <span class="" data-type='0'>开发中</span>
            <span class="" data-type='0'>运行中</span>
            <span class="" data-type='0'>已锁定</span>
          </span>
          <span class="input-box">
            <el-input placeholder="搜索产品" v-model="product.key" 
              class="input-with-select" size="small">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </span>
        </div>
      </div>
      <div class="list-body">
        <div class="add-btn" @click="newProduct">
            <span class="btn"><d2-icon name="plus"/>新增</span>
        </div>
        <div v-if="product.list&&(product.list.length>0)" class="list">
          <div class="item" v-for="(p,i) in product.list" :key="'product'+i">
            <div class="meta-box">
              <div class="icon">
                <img v-if="p.logo&&p.logo.length>0" :src="p.logo"/>
                <d2-icon v-else name='file-o'/>
              </div>
              <div class="meta">
                <div class="name">{{p.name}}</div>
                <div class="desc">{{p.description}}</div>
              </div>
            </div>
            <div class="tags">
              <div class="title">标签</div>
              <div class="content">
                <span class="tag" v-for="(t,j) in p.tags" :key="'tag'+j">
                  {{ t }}
                </span>
              </div>
            </div>
            <div class="time">
              <div class="title">创建时间</div>
              <div class="content">{{p.createTime}}</div>
            </div>
            <div class="operate">
              <span @click="editProduct(p)">编辑</span>
              <span>设计</span>
              <span>模块</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <d2-icon name="file-o"/>
          <div class="text">No data</div>
        </div>
      </div>
    </div>
    <!-- 编辑产品 -->
    <el-dialog title="编辑产品" class="product-edit-dialog"
      :visible.sync="detail.visible" >
        <el-form :model="detail.data" status-icon :rules="detail.rules" label-width="50px"
          ref="productEditForm" class="product-edit-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="detail.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="detail.data.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tag">
            <el-select v-model="detail.data.tags"
              multiple filterable allow-create default-first-option
              placeholder="请添加产品标签">    
            </el-select>
          </el-form-item>
          <el-form-item label="协议" prop="type">
            <el-select v-model="detail.data.protocol" no-match-text='请选择' placeholder="请选择">
              <el-option label="TCP" :value="0"></el-option>
              <el-option label="MQTT" :value="1"></el-option>
              <el-option label="HTTP" :value="2"></el-option>
              <el-option label="COAP" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="detail.data.type" no-match-text='请选择' placeholder="请选择">
              <el-option label="通用" :value="1"></el-option>
              <!-- <el-option label="批量项目" :value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <!-- 产品属性 -->
          <el-form-item label="属性" class="param">
            <div class="param-box">
              <div class="item" v-for="(p, i) in detail.data.parameters" :key="'param'+i">
                <span class="elem field">
                  <el-input placeholder="字段名" v-model="p.field"/>
                </span>
                <span class="elem type">
                  <el-select v-model="p.type">
                    <el-option label="Number" :value="1"></el-option>
                    <el-option label="String" :value="2"></el-option>
                    <el-option label="Boolean" :value="3"></el-option>
                    <el-option label="JSON" :value="4"></el-option>
                  </el-select>
                </span>
                <span class="elem default">
                  <el-input placeholder="默认值" v-model="p.defaultValue"/>
                </span>
                <span class="elem desc">
                  <el-input placeholder="备注" v-model="p.description"/>
                </span>
                <span class="elem close" @click="removeParam(i)"><d2-icon name='close'/></span>
              </div>
              <div class="item add-btn" @click="addParam"><d2-icon name="plus"/>新增</div>
            </div>
          </el-form-item>
          <el-form-item label="图标">
            <div class="icon-add-btn">
                  <img v-if="detail.data.logo&&detail.data.logo.length>0" :src="detail.data.logo">
                  <div class="icon-box" @click="icon.visible=true">
                    <img class="img" v-if="detail.data.logo&&detail.data.logo.length>0" 
                    :src="detail.data.logo"/>
                    <d2-icon v-else name='plus'/>
                  </div>
              </div>
          </el-form-item>
          <el-form-item label="图标">
            <el-button type="primary" @click="editSubmit">提交</el-button>
            <el-button @click="icon.visible=false">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 选择图标 -->
    <el-dialog title="选择图标" class="icon-dialog"
      :visible.sync="icon.visible" >
      <div class="list" >
        <img class="item" v-for="(item,index) in icon.list" :key="'icon'+index" 
        @click="chooseIcon(item)" :src="item"/>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api'
export default {
  name: 'project-product',
  data(){
    return {
      id: 0,
      stat:{
        all: 0,
        dev: 0,
        run: 0,
        lock: 0,
      },
      product:{
        list:[],
        key: '',
        current: 1,
        size: 10,
        total: 0
      },
      detail:{
        data: {},
        visible: false,
        rules:{}
      },
      icon:{
        list:[],
        visible: false
      }
    }
  },
  mounted(){
    this.id = this.$route.params.projectId
    this.productList()
    this.getIcon()
  },
  methods:{
    getIcon(){

    },
    productList(){
      const that = this
      const params = {
        projectId: that.id,
        current: that.product.current,
        size: that.product.size,
      }
      api.PRODUCT_LIST(params).then(res=>{
        that.product.list = res.records
        that.product.total = res.total
        console.log(that.product)
      })
    },
    newProduct(){
      this.detail.data = {
        // "projectId": 1,
        "name": "",
        "type": "",
        "logo": "",
        "tags": "",
        'protocol': 0,
        "parameters": [],
        "description": ""
      }
      this.detail.visible = true
    },
    editProduct(item){
      this.detail.data = item
      this.detail.visible = true
    },
    addParam(){
      this.detail.data.parameters.push({
        field:'', type:1, defaultValue:'', description:'',
      })
    },
    removeParam(index){
      this.detail.data.parameters.splice(index, 1)
    },
    chooseIcon(item){
      this.detail.data.logo = item
    },
    editSubmit(){
      const that = this
      const data = that.detail.data

      const id = data.id
      const d = {
        projectId: that.id,
        name: data.name,
        type: data.type,
        logo: data.logo,
        tags: data.tags,
        protocol: data.protocol,
        parameters: data.parameters,
        description: data.description,
      }
      if (id==undefined){
        api.PRODUCT_CREATE(d).then(res=>{
          that.detail.visible = false
          that.productList()
        })
        return
      }
      api.PRODUCT_UPDATE(id, d).then(res=>{
        that.detail.visible = false
        that.productList()
      })
    }
  }
}
</script>

<style lang='scss'>
.product-container{
  .stat{
    display: flex;
    justify-content: space-between;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .item{
      text-align: center;
      width: 25%;
      .title{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 5px;
      }
      .count{
        font-size: 24px;

      }
    }
    .item + .item{
      border-left: 1px solid #f0f0f0;
    }
  }
  .list-box{
    margin-top: 28px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 24px;

    .list-head{
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      .title{}
      .right{

        .type-list{
          span{
            color: rgba(0, 0, 0, 0.65);
            border: 1px solid #d7dae2;
            box-sizing: border-box;
            padding: 0 15px;
            height: 32px;
            display: inline-block;
            position: relative;
            cursor: pointer;
            &:hover{
              z-index: 1;
              border: 1px solid #303133;
              color: #303133;
            }
          }
          span + span{
            // border-left: 1px solid #d7dae2;
            margin-left: -1px;
          }
        }
        .input-box{
          width: 240px;
          margin-left: 20px;
          display: inline-block;
        }
      }
    }
    .list-body{
      margin-top: 20px;
      .add-btn{
        display: inline-block;
        border: 1px dashed #d9d9d9;
        text-align: center;
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
        &:hover{
          border: 1px dashed #40475c;
          color: #40475c;
        }
        .btn{
          .fa{
            margin-right: 6px;
          }
        }
      }
      .no-data{
        text-align: center;
        padding: 20px 0;
        color: #aaa;
        .text{
          margin-top:10px
        }
      }
      .list{
        .item{
          display: flex;
          justify-content: space-between;
          margin-top: 20px ;
          font-size: 14px;
          .meta-box{
            display: flex;
              width: 40%;
            .icon{
              width: 48px;
              height: 48px;
              text-align: center;
              line-height: 28px;
              border: 1px solid #ddd;
              border-radius: 5px;
              .img{
                width: 100%;
              }
              .fa{
                font-size: 24px;
              }
            }
            .meta{
              margin-left: 16px;
              right: 0px;
              .name{
                color: rgba(0, 0, 0, 0.65);
                margin-bottom: 4px;
              }
              .desc{
                color: rgba(54, 48, 48, 0.45);
              }
            }
          }
          .tags, .time{
            flex: 0 0 auto;
            margin-left: 30px;
            color: rgba(54, 48, 48, 0.45);
            text-align: right;
            .title{
              margin-bottom: 4px;
            }
          }
          .tags{
            width: 14%;
            .content{
              .tag{
                border: 1px solid #ccc;
                margin-left: 8px;
                padding: 0 7px;
                color: rgba(0,0,0,0.65);
                background-color: #FAFAFA;
              }
            }
          }
          .operate{
            color: #2a314e;
            line-height: 50px;
            padding: 0 10px;
            flex: 0 0 auto;
            span{
              cursor: pointer;
              padding: 0 8px;
            }
            span + span{
              border-left: 1px solid #ddd;
            }
          }
        }
      }
    }
  }
  .product-edit-dialog{
    .product-edit-form{
     .param{
       .param-box{
         .item{
           line-height: 32px;
           font-size: 14px;
           height: 32px;
           .elem {
             display: inline-block;
             width: 20%;
             z-index: 9;
             .el-input__inner{
               height: 32px;
               border-radius: 0px;
             }
             &:hover{
                z-index: 9999;
                border-color: #555;
             }
           }
           .elem + .elem{
             margin-left: -1px;
           }
           .field{
             width: 25%;
           }
           .desc{
             width: 29%;
           }
           .close{
             width: 6%;
             border: 1px solid #ddd;
             font-size: 14px;
              text-align: center;
              line-height: 30px;
              &:hover{
                cursor: pointer;
              }
           }
         }
         .item + .item{
           margin-top: 14px;
         }
         .add-btn{
           border: 1px dashed #ddd;
           text-align: center;
           color: #999;
           cursor: pointer;
           &:hover{
             border-color: #999;
             color: #555;
           }
           .fa{
             margin-right: 6px;
           }
         }
       }
     } 
     .icon-add-btn{
          border: 1px solid #ccc;
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
          &:hover{
            border-color: #777;
          }
          .icon-box{
       
              .img{
                  width: 100%;
              }
          }
     }
    }
  }
  .icon-dialog{
  .list{
    .item{
      width: 48px;
      height: 48px;
      margin: 5px 10px;
    }
  }
}
}
</style>
