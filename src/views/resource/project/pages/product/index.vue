<template>
  <d2-container class="product-container" v-loading="product.loading">
    <!-- 产品列表 -->
    <div class="list-box">
      <!-- 表头 -->
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
      <!-- 列表 -->
      <div class="list-body">
        <!-- 新增按钮 -->
        <div class="add-btn" @click="newProduct">
            <span class="btn"><d2-icon name="plus"/>新增</span>
        </div>
        <!-- 有数据时显示 -->
        <div v-if="product.list&&(product.list.length>0)" class="list">
          <el-table :data="product.list">
            <el-table-column label="产品图标">
              <template slot-scope="scope">
                <div class="icon">
                  <img :src="scope.row.logo" alt="icon"/>
                </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="description" label="产品简介"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="tool">
                <span @click="editProduct(scope.row)">编辑</span>
                <span><router-link class="design-btn" 
                :to="{path:'/product/'+scope.row.id+'/detail'}">
                详情
                </router-link></span>
                <!-- <span>
                  <router-link class="design-btn" :to="{path:'/product/'+p.id+'/design'}">
                  设计
                  </router-link>
                </span> -->
              <span @click="openModule(scope.row.id)">模块</span>
              <span >删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 无数据提示 -->
        <div v-else class="no-data">
          <d2-icon name="file-o"/><div class="text">No data</div>
        </div>
        <!-- 产品分页 -->
        <el-pagination v-if="product.total>product.size" class="product-page" layout="prev, pager, next"
        :page-size="product.size" :total="product.total"></el-pagination>
      </div>
    </div>
    <!-- 编辑产品弹窗 -->
    <el-dialog title="编辑产品" class="product-edit-dialog" :visible.sync="detail.visible" >
      <product-edit :data='detail.data' :handle='editSubmit'></product-edit>
    </el-dialog>
    <!-- 模块抽屉 -->
    <el-drawer title="模块管理" class="module-drawer"
      :visible.sync="module.visible">
      <module :data="module.data" :id="module.productId"/>
    </el-drawer>
  </d2-container>
</template>

<script>
import api from '@/api'
import ProductEdit from './edit.vue'
import Module from './components/module/module.vue'
import ModuleEdit from './components/module/module_edit.vue'
import ModuleTemplate from './components/module/module_template.vue'

export default {
  name: 'project-product',
  components: {
    ProductEdit,
    Module,
    ModuleEdit,
    ModuleTemplate
  },
  data () {
    return {
      id: 0, //projectId
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
        total: 0,
        loading: false,
      },
      detail: {
        data: {},
        visible: false,
        rules: {}
      },
      module: {
        productId: 0,
        data: [],
        current: 1,
        size: 10,
        total: 0,
        visible: false
      }
    }
  },
  mounted () {
    this.id = this.$route.params.projectId
    this.productList()
  },
  methods: {
    productList () {
      const that = this
      const params = {
        projectId: that.id,
        current: that.product.current,
        size: that.product.size
      }
      that.product.loading = true
      api.PRODUCT_LIST(params).then(res => {
        that.product.list = res.records
        that.product.total = res.total
        that.product.loading = false
      }).catch(err=>{
       that.product.loading = false
      })
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
      const data = { ...item, parameters: [...item.parameters] }
      this.detail.data = data
      this.detail.visible = true
    },
    editSubmit (item) {
      const that = this
      const id = item.id
      const data = {
        projectId: that.id,
        name: item.name,
        type: item.type,
        logo: item.logo,
        tags: item.tags,
        protocol: item.protocol,
        parameters: item.parameters,
        description: item.description
      }
      if (id == undefined) {
        api.PRODUCT_CREATE(data).then(res => {
          that.detail.visible = false
          that.productList()
        })
        return
      }
      api.PRODUCT_UPDATE(id, data).then(res => {
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
      that.loading = true
      this.$api.MODULE_LIST(params).then(res => {
        that.module.data = res.records
        that.module.total = res.total
        that.module.visible = true
        that.module.productId = id
        that.loading = false
      }).catch(err => {
        console.log(err)
        that.loading = false
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
        margin-top: 10px;
        // border-top: 1px solid #ddd;
        .el-table{
          .icon{
            width: 48px;
            height: 48px;
            text-align: center;
            line-height: 50px;
            color: #999;
            border: 1px solid #ddd;
            border-radius: 5px;
            img{
              width: 100%;
            }
          }
          .tool{
            span{
              cursor: pointer;
              padding-right: 6px;
              a{
                color: #606266;
              }
            }
          }
        }
        // .item{
        //   display: flex;
        //   justify-content: space-between;
        //   margin-top: 20px ;
        //   font-size: 14px;
        //   .meta-box{
        //     display: flex;
        //       width: 40%;
        //     .icon{
        //       width: 48px;
        //       height: 48px;
        //       text-align: center;
        //       line-height: 50px;
        //       color: #999;
        //       border: 1px solid #ddd;
        //       border-radius: 5px;
        //       img{
        //         width: 100%;
        //       }
        //       .fa{
        //         font-size: 24px;
        //       }
        //     }
        //     .meta{
        //       margin-left: 16px;
        //       right: 0px;
        //       .name{
        //         color: rgba(0, 0, 0, 0.65);
        //         margin-bottom: 4px;
        //       }
        //       .desc{
        //         color: rgba(54, 48, 48, 0.45);
        //       }
        //     }
        //   }
        //   // .tags, .time{
        //   //   flex: 0 0 auto;
        //   //   margin-left: 20px;
        //   //   color: rgba(54, 48, 48, 0.45);
        //   //   text-align: right;
        //   //   .title{
        //   //     margin-bottom: 4px;
        //   //   }
        //   // }
        //   // .tags{
        //   //   width: 24%;
        //   //   .content{
        //   //     .tag{
        //   //       border: 1px solid #ccc;
        //   //       margin-left: 8px;
        //   //       padding: 0 7px;
        //   //       color: rgba(0,0,0,0.65);
        //   //       background-color: #FAFAFA;
        //   //     }
        //   //   }
        //   // }
        //   .operate{
        //     color: #2a314e;
        //     line-height: 50px;
        //     padding: 0 10px;
        //     flex: 0 0 auto;
        //     span{
        //       cursor: pointer;
        //       padding: 0 8px;
        //       a{
        //         color: #2a314e;
        //       }
        //     }
        //     span + span{
        //       border-left: 1px solid #ddd;
        //     }
        //   }
        // }
      }
      .product-page{
        margin-top: 20px;
      }
    }
  }
}
</style>
