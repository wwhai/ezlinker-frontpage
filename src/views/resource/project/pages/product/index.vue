<template>
  <d2-container class="project-product-container" v-loading="product.loading">
    <el-card class="box-card" >
      <!-- <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="设备列表"></el-page-header>
      </div> -->
    <!-- 页头 -->
    <div slot="header" class="clearfix">
      <el-page-header @back="goBack" content="产品管理"></el-page-header>
    </div>

    <!-- 产品列表 -->
    <div class="list-box">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="查询设备">
          <el-input v-model="searchParam.user" placeholder="名称/型号/SN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="newProduct" type="success">创建产品</el-button>
        </el-form-item>
      </el-form>

      <!-- 列表 -->
      <div class="list-body">
        <!-- 有数据时显示 -->
        <div v-if="product.list&&(product.list.length>0)" class="list">
          <el-table :data="product.list">
            <el-table-column label="产品图标">
              <template slot-scope="scope">
                <div class="icon">
                  <img :src="scope.row.logo" alt="icon" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="description" label="产品简介"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="tool">
                  <el-link type="primary" @click="editProduct(scope.row)">编辑</el-link>
                  <el-link type="info" @click="gotoDetailPage(scope.row.id)">详情</el-link>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      更多<em class="el-icon-arrow-down el-icon--right"></em>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-setting">
                        <span type="success" @click="openModule(scope.row.id)">模块管理</span>
                      </el-dropdown-item>
                      <el-dropdown-item icon="el-icon-mobile-phone">
                        <span type="warning" @click="newDevice(scope.row.id)">创建设备</span>
                      </el-dropdown-item>

                      <!-- <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item> -->
                      <!-- <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 无数据提示 -->
        <div v-else class="no-data">
          <d2-icon name="file-o" />
          <div class="text">No data</div>
        </div>
        <!-- 产品分页 -->
        <el-pagination
          v-if="product.total>product.size"
          class="product-page"
          layout="prev, pager, next"
          :page-size="product.size"
          :total="product.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑产品弹窗 -->
    <el-dialog title="编辑产品" class="product-edit-dialog" :visible.sync="detail.visible" width="40%">
      <product-edit :data="detail.data" :handle="editSubmit"></product-edit>
    </el-dialog>
    <!-- 模块抽屉 -->
    <el-drawer title="模块管理" class="module-drawer" :visible.sync="module.visible">
      <module :data="module.data" :id="module.productId" />
    </el-drawer>
    <!-- 新建设备 -->
    <el-dialog title="创建设备" :visible.sync="device.visible" width="40%">
      <device-edit :data='device.data' :submit="createDevice" :cancel="()=>{device.visible=false}"/>
    </el-dialog>
    </el-card>
  </d2-container>
</template>

<script>
import api from "@/api";
import ProductEdit from "./edit.vue";
import Module from "../../components/module/module.vue";
import ModuleEdit from "../../components/module/module_edit.vue";
import ModuleTemplate from "../../components/module/module_template.vue";
import DeviceEdit from "../../components/device/device_edit.vue";

export default {
  name: "project-product",
  components: {
    ProductEdit,
    Module,
    ModuleEdit,
    ModuleTemplate,
    DeviceEdit,
  },
  data() {
    return {
      searchParam: {},
      //-------
      id: 0, //projectId
      stat: {
        all: 0,
        dev: 0,
        run: 0,
        lock: 0,
      },
      product: {
        list: [],
        select: "0",
        key: "",
        current: 1,
        size: 10,
        total: 0,
        loading: false,
      },
      // product edit
      detail: {
        data: {},
        visible: false,
        rules: {},
      },
      module: {
        productId: 0,
        data: [],
        current: 1,
        size: 10,
        total: 0,
        visible: false,
      },
      device:{
        data:{},
        visible: false,
      },
    };
  },
  mounted() {
    this.id = this.$route.params.projectId;
    this.productList();
  },
  methods: {
    goBack(){
      this.$router.push({name:'project'})
    },
 
    gotoDetailPage(id) {
      // this.$router.push("/product/" + id + "/detail");
      this.$router.push({name:'product-detail', params:{'productId': id}})
    },

    // 关键字检索产品
    onSearch(){

    },
    // ------产品--------
    productList() {
      const that = this;
      const params = {
        projectId: that.id,
        current: that.product.current,
        size: that.product.size,
      };

      that.product.loading = true;
      api.PRODUCT_LIST(params)
        .then((res) => {
          that.product.list = res.records;
          that.product.total = res.total;
          that.product.loading = false;
        })
        .catch((err) => {
          that.product.loading = false;
        });
    },
    newProduct() {
      this.detail.data = {
        name: "",
        type: "1",
        logo: "",
        tags: "",
        protocol: 0,
        parameters: [],
        description: "",
      };
      this.detail.visible = true;
    },
    editProduct(item) {
      if (item.type != 1) {
        item.type = "";
      }
      const data = { ...item, parameters: [...item.parameters] };
      this.detail.data = data;
      this.detail.visible = true;
    },
    editSubmit(item) {
      const that = this;
      const id = item.id;
      const data = {
        projectId: that.id,
        name: item.name,
        type: item.type,
        logo: item.logo,
        tags: item.tags,
        protocol: item.protocol,
        parameters: item.parameters,
        description: item.description,
      };
      if (id == undefined) {
        api.PRODUCT_CREATE(data).then((res) => {
          that.detail.visible = false;
          that.productList();
        });
        return;
      }
      api.PRODUCT_UPDATE(id, data).then((res) => {
        that.detail.visible = false;
        that.productList();
      });
    },
    // ------模块-------
    // 打开产品模块
    openModule(id) {
      const that = this;
      const params = {
        productId: id,
        current: that.module.current,
        size: that.module.size,
      };
      that.loading = true;
      this.$api
        .MODULE_LIST(params)
        .then((res) => {
          that.module.data = res.records;
          that.module.total = res.total;
          that.module.visible = true;
          that.module.productId = id;
          that.loading = false;
        })
        .catch((err) => {
          console.log(err);
          that.loading = false; 
        });
    },
    // --------设备-----------
    newDevice(productId){
      if (!productId){
        this.$message({
          message: "错误的productId",
          type: "error",
        });
      }

      this.device.data = {
        projectId: this.id,
        productId: productId,
        name: "新设备",
        location: "0,0",
        industry: "厂家",
        model: "型号",
        createCount: 1,
        description: "产品描述",
      }
      // console.log(this.device)
      this.device.visible = true
    },
    createDevice(data) {
      let _this = this;
      // console.log(this.newDevice);
      this.$api.DEVICE_CREATE(data)
        .then((res) => {
          if (res.id > 0) {
            _this.$message({
              message: "设备创建成功",
              type: "success",
            });
            _this.device.data = {}
            _this.device.visible = false;
          } else {
            this.$message({
              message: "设备创建失败",
              type: "error",
            });
          }
        })
        .catch((e) => {
          this.$message({
            message: "设备创建失败",
            type: "error",
          });
        });
    },
    // --------调度任务-----------
    newSchedule(productId){

    },
  },
};
</script>

<style lang='scss'>
.project-product-container {
  .box-card{
    height: 99%;
  }
  .list-box {

    .list-head {
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      .right {
        .type-list {
          span {
            color: rgba(0, 0, 0, 0.65);
            border: 1px solid #d7dae2;
            box-sizing: border-box;
            padding: 0 15px;
            height: 32px;
            display: inline-block;
            position: relative;
            cursor: pointer;
            &:hover {
              z-index: 1;
              border: 1px solid #303133;
              color: #303133;
            }
          }
          span + span {
            // border-left: 1px solid #d7dae2;
            margin-left: -1px;
          }
          .active {
            z-index: 1;
            border: 1px solid #303133;
            color: #303133;
          }
        }
        .input-box {
          width: 240px;
          margin-left: 20px;
          display: inline-block;
        }
      }
    }
    .list-body {
      margin-top: 20px;
      .add-btn {
        display: inline-block;
        border: 1px dashed #d9d9d9;
        text-align: center;
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
        &:hover {
          border: 1px dashed #40475c;
          color: #40475c;
        }
        .btn {
          .fa {
            margin-right: 6px;
          }
        }
      }
      .no-data {
        text-align: center;
        padding: 20px 0;
        color: #aaa;
        .text {
          margin-top: 10px;
        }
      }
      .list {
        margin-top: 10px;
        // border-top: 1px solid #ddd;
        .el-table {
          .icon {
            width: 48px;
            height: 48px;
            text-align: center;
            line-height: 50px;
            color: #999;
            border: 1px solid #ddd;
            border-radius: 5px;
            img {
              width: 100%;
            }
          }
          .tool {
            span {
              cursor: pointer;
              padding-right: 6px;
              a {
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
      .product-page {
        margin-top: 20px;
      }
    }
  }
}
</style>
