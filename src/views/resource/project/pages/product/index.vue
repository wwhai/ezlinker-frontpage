<template>
  <d2-container class="product-container">
    <!-- 产品列表 -->
    <div class="list-box">
      <div class="list-head">
        <div class="title">产品列表</div>
        <div class="right">
          <!-- 数据检索 -->
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
              <span>
                  <router-link class="design-btn" :to="{path:'/product/'+p.id+'/detail'}">
                详情</router-link>
                </span>
                <!-- <span>
                  <router-link class="design-btn" :to="{path:'/product/'+p.id+'/design'}">
                  设计
                  </router-link>
                </span> -->
              <span @click="openModule(p.id)">模块</span>
              <span >删除</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <d2-icon name="file-o"/>
          <div class="text">No data</div>
        </div>
      </div>
    </div>
    <!-- 编辑产品弹窗 -->
    <el-dialog title="编辑产品" class="product-edit-dialog"
      :visible.sync="detail.visible" >
      <product-edit :data='detail.data' :handle='editSubmit'></product-edit>
        <!-- <el-form :model="detail.data" status-icon :rules="detail.rules" label-width="50px"
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
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="detail.data.protocol" no-match-text='请选择' placeholder="请选择">
              <el-option label="TCP" :value="0"></el-option>
              <el-option label="MQTT" :value="1"></el-option>
              <el-option label="HTTP" :value="2"></el-option>
              <el-option label="COAP" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="detail.data.type" placeholder="请选择">
              <el-option label="通用" value="1"></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item>
            <el-button type="primary" @click="editSubmit">提交</el-button>
            <el-button @click="detail.visible=false">取消</el-button>
          </el-form-item>
        </el-form> -->
    </el-dialog>
    <!-- 选择图标弹窗 -->
    <el-dialog title="选择图标" class="icon-dialog"
      :visible.sync="icon.visible" >
      <div class="list" >
        <img class="item" v-for="(item,index) in icon.list" :key="'icon'+index"
        @click="chooseIcon(item)" :src="item"/>
      </div>
    </el-dialog>
    <!-- 模块抽屉 -->
    <el-drawer
      title="模块管理" class="module-drawer"
      :visible.sync="module.visible"
      >
      <div class="module-list">
        <div class="add-btn" @click="newModule">
            <span class="btn" ><d2-icon name="plus"/>新增</span>
        </div>
        <div class="item" v-for="(v,k) in module.data" :key="'module'+k">
          <div class="meta-box">
            <div class="icon-box">
              <img :src="v.icon"/>
            </div>
            <div class="meta">
              <div class="title">{{v.name}}</div>
              <div class="desc">{{v.description}}</div>
            </div>
          </div>
          <div class="edit-btn" @click="editModule(v)">
            编辑<d2-icon name='angle-right'/>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 选择模块模板 -->
    <el-drawer :visible.sync="module.template.visible"
      title="选择模板" class="module-temp-drawer">
      <div class="module-list">
        <div class="item" v-for="(v,k) in module.template.data" :key="'moduleTemp'+k">
          <div class="meta-box">
            <div class="icon-box">
              <img :src="v.icon"/>
            </div>
            <div class="meta">
              <div class="title">{{v.name}}</div>
              <div class="desc">{{v.description}}</div>
            </div>
          </div>
          <div class="edit-btn" @click="editModule(v)">
            选择<d2-icon name='angle-right'/>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 编辑模块抽屉 -->
    <el-drawer :visible.sync="module.detail.visible"
      title="模块编辑" class="module-edit-drawer">
      <el-form :model="module.detail.data" label-width="40px" class="edit-form">
        <el-form-item label="名称">
          <el-input v-model="module.detail.data.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="module.detail.data.description"></el-input>
        </el-form-item>
        <el-form-item label="属性" class="param">
            <div class="param-box">
              <div class="item" v-for="(p, i) in module.detail.data.dataAreas" :key="'param'+i">
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
                <span class="elem close" @click="removeModuleParam(i)"><d2-icon name='close'/></span>
              </div>
              <div class="item add-btn" @click="addModuleParam"><d2-icon name="plus"/>新增</div>
            </div>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="submitModule">提交</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </d2-container>
</template>

<script>
import api from '@/api'
import ProductEdit from './components/edit'

export default {
  name: 'project-product',
  components:{
    ProductEdit
  },
  data () {
    return {
      id: 0,
      stat: {
        all: 0,
        dev: 0,
        run: 0,
        lock: 0
      },
      product: {
        list: [],
        select: '0',
        key: '',
        current: 1,
        size: 10,
        total: 0
      },
      detail: {
        data: {},
        visible: false,
        rules: {}
      },
      icon: {
        list: [],
        visible: false
      },
      module: {
        productId: 0,
        data: [],
        current: 1,
        size: 10,
        total: 0,
        visible: false,
        detail: {
          data: {},
          visible: false
        },
        template: {
          data: [],
          visible: false
        }
      }
    }
  },
  mounted () {
    this.id = this.$route.params.projectId
    this.productList()
    this.getIcon()
  },
  methods: {
    getIcon () {

    },
    productList () {
      const that = this
      const params = {
        projectId: that.id,
        current: that.product.current,
        size: that.product.size
      }
      api.PRODUCT_LIST(params).then(res => {
        that.product.list = res.records
        that.product.total = res.total
        console.log(that.product)
      })
    },
    chooseType (event) {
      const type = event.target.dataset.type
      if (type) {
        this.product.select = type
        // TODO 检索操作
      }
    },
    newProduct () {
      this.detail.data = {
        name: '',
        type: '1',
        logo: '',
        tags: '',
        protocol: 0,
        parameters: [],
        description: ''
      }
      this.detail.visible = true
    },
    editProduct (item) {
      if (item.type != 1) {
        item.type = ''
      }
      this.detail.data = {...item}
      this.detail.visible = true
    },
    addParam () {
      this.detail.data.parameters.push({
        field: '', type: 1, defaultValue: '', description: ''
      })
    },
    removeParam (index) {
      this.detail.data.parameters.splice(index, 1)
    },
    chooseIcon (item) {
      this.detail.data.logo = item
    },
    editSubmit (data) {
      const that = this
      // const data = that.detail.data

      const id = data.id
      const d = {
        projectId: that.id,
        name: data.name,
        type: data.type,
        logo: data.logo,
        tags: data.tags,
        protocol: data.protocol,
        parameters: data.parameters,
        description: data.description
      }
      if (id == undefined) {
        api.PRODUCT_CREATE(d).then(res => {
          that.detail.visible = false
          that.productList()
        })
        return
      }
      api.PRODUCT_UPDATE(id, d).then(res => {
        that.detail.visible = false
        that.productList()
      })
    },
    // 打开产品模块
    openModule (id) {
      const that = this
      const params = {
        productId: id,
        current: that.module.current,
        size: that.module.size
      }
      this.$api.MODULE_LIST(params).then(res => {
        that.module.data = res.records
        that.module.total = res.total
        that.module.visible = true
        that.module.productId = id
      })
    },
    moduleTemplateAll () {
      const that = this
      this.$api.MODULE_TYPE_ALL().then(res => {
        var data = []
        for (const o of res) {
          data.push({
            icon: o.icon,
            type: o.name,
            name: o.label,
            protocol: o.protocol,
            model: o.model,
            description: o.description,
            dataAreas: []
          })
        }
        that.module.template.data = data
      })
    },
    newModule () {
      // const data = {
      //   "type": 1,
      //   "name": "",
      //   "protocol": 1,
      //   "model": "",
      //   "description": "",
      //   "dataAreas": [],
      // }

      // this.editModule(data)
      this.moduleTemplateAll()
      this.module.template.visible = true
    },
    editModule (item) {
      this.module.detail.data = { ...item }
      this.module.template.visible = false
      this.module.detail.visible = true
    },
    addModuleParam () {
      this.module.detail.data.dataAreas.push({
        field: '', type: 1, defaultValue: '', description: ''
      })
    },
    removeModuleParam (index) {
      this.module.detail.data.dataAreas.splice(index, 1)
    },
    submitModule () {
      const that = this
      const id = that.module.detail.data.id
      const data = {
        productId: that.module.productId,
        ...that.module.detail.data
      }
      if (id == undefined) {
        that.$api.MODULE_TEMPLATE_CREATE(data).then(res => {
          that.module.detail.data = {}
          that.module.detail.visible = false
        })
        return
      }
      that.$api.MODULE_TEMPLATE_UPDATE(id, data).then(res => {
        that.module.detail.data = {}
        that.module.detail.visible = false
        that.module.visible = false
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
          .active{
            z-index: 1;
            border: 1px solid #303133;
            color: #303133;
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
              line-height: 50px;
              color: #999;
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
            margin-left: 20px;
            color: rgba(54, 48, 48, 0.45);
            text-align: right;
            .title{
              margin-bottom: 4px;
            }
          }
          .tags{
            width: 24%;
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
              a{
                color: #2a314e;
              }
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
  .module-drawer, .module-temp-drawer{
    .module-list{
      padding: 0 20px;
      .item{
        text-align: center;
        display: flex;
        justify-content: space-between;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        padding: 10px 8px;
        margin-top: 20px;
        .meta-box{
          display: flex;
          .icon-box{
            width: 35px;
            height: 35px;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            img{
              width: 100%;
            }
          }
          .meta{
            margin: 0 10px;
            text-align: left;
            .title{
              color: rgba(0, 0, 0, 0.65);
            }
            .desc{
              color: rgba(0, 0, 0, 0.45);
              font-size: 14px;
            }
          }
        }
        .edit-btn{
          cursor: pointer;
          font-size: 14px;
          line-height: 37px;
          color: #777;
          &:hover{
            color: #333;
          }
          .fa{
            margin: 0 4px;
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
  .module-edit-drawer{
    .edit-form{

    padding: 0 20px;
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
