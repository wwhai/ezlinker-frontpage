<template>
  <d2-container class="project-product-container" v-loading="product.loading">
    <el-card class="box-card" style="min-height: 99%">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="产品管理"></el-page-header>
      </div>

      <!-- 产品列表 -->
      <div class="list-box">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="查询设备">
            <el-input v-model="searchParam.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="search">查询</el-button>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button @click="newProduct" plain type="success">新建</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表 -->
        <div class="list-body">
          <!-- 有数据时显示 -->
          <div v-if="product.list && product.list.length > 0" class="list">
            <el-table :data="product.list">
              <el-table-column label="产品图标">
                <template slot-scope="scope">
                  <div class="icon">
                    <img :src="scope.row.logo" alt="icon" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="产品名称"></el-table-column>
              <el-table-column
                prop="description"
                label="产品简介"
              ></el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="tool">
                    <el-button
                      class="item"
                      size="mini"
                      plain
                      type="primary"
                      @click="editProduct(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      class="item"
                      size="mini"
                      plain
                      type="primary"
                      @click="gotoDetailPage(scope.row.id)"
                      >详情</el-button
                    >
                    <el-dropdown>
                      <span class="el-dropdown-link" style="margin-left: 8px">
                        更多
                        <em class="el-icon-arrow-down el-icon--right"></em>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-document-add">
                          <span @click="newDevice(scope.row.id)">创建设备</span>
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-c-scale-to-original">
                          <span @click="gotoDeviceList(scope.row.id)"
                            >设备列表</span
                          >
                        </el-dropdown-item>
                        <el-dropdown-item icon="el-icon-delete">
                          <span @click="removeProduct(scope.row.id)"
                            >删除产品</span
                          >
                        </el-dropdown-item>
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
            v-if="product.total > product.size"
            class="product-page"
            layout="prev, pager, next"
            :page-size="product.size"
            :total="product.total"
          ></el-pagination>
        </div>
      </div>
      <!-- 编辑产品弹窗 -->
      <el-dialog
        title="编辑产品"
        class="product-edit-dialog"
        :visible.sync="detail.visible"
        width="50%"
      >
        <template>
          <product-edit :data="detail.data" :handle="editSubmit"></product-edit>
        </template>
      </el-dialog>
      <!-- 模块抽屉 -->
      <el-drawer
        title="模块管理"
        class="module-drawer"
        :visible.sync="module.visible"
      >
        <module :data="module.data" :id="module.productId" />
      </el-drawer>
      <!-- 新建设备 -->
      <el-dialog title="创建设备" :visible.sync="device.visible" width="50%">
        <device-edit
          :data="device.data"
          :submit="createDevice"
          :cancel="
            () => {
              device.visible = false;
            }
          "
        />
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
      searchParam: {
        name: null,
      },
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
      device: {
        data: {},
        visible: false,
      },
      //
      activeTab: "Tab1",
    };
  },
  mounted() {
    this.projectId = this.$route.params.projectId;
    this.productList();
  },
  methods: {
    goBack() {
      this.$router.push({ name: "project" });
    },
    // 删除
    removeProduct(id) {
      this.$confirm("此操作将永久删除产品的所有信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api
            .REMOVE_PRODUCT([id])
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.productList();
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消删除",
          });
        });
    },
    // 列表
    gotoDeviceList(productId) {
      this.$router.push({
        name: "project-device",
        params: {
          projectId: this.$route.params.projectId,
          productId: productId,
        },
      });
    },
    //
    gotoDetailPage(productId) {
      this.$router.push({
        name: "product-detail",
        params: {
          productId: productId,
          projectId: this.$route.params.projectId,
        },
      });
    },

    // 关键字检索产品
    search() {
      console.log("搜索:", this.searchParam);
    },
    // ------产品--------
    productList() {
      //
      const params = {
        projectId: this.projectId,
        current: this.product.current,
        size: this.product.size,
      };

      this.product.loading = true;
      api
        .PRODUCT_LIST(params)
        .then((res) => {
          this.product.list = res.records;
          this.product.total = res.total;
          this.product.loading = false;
        })
        .catch((err) => {
          this.product.loading = false;
        });
    },
    newProduct() {
      this.detail.data = {
        name: "",
        type: "1",
        logo: "",
        tags: "",
        protocol: 0,
        fieldParams: [],
        description: "",
      };
      this.detail.visible = true;
    },
    editProduct(item) {
      if (item.type != 1) {
        item.type = "";
      }
      const data = { ...item, fieldParams: [...item.fieldParams] };
      this.detail.data = data;
      this.detail.visible = true;
    },
    // 新建产品
    editSubmit(item) {
      //
      const id = item.id;
      const data = {
        projectId: this.projectId,
        name: item.name,
        type: item.type,
        logo: item.logo,
        tags: item.tags,
        protocol: item.protocol,
        fieldParams: item.fieldParams,
        description: item.description,
      };
      for (let field of item.fieldParams) {
        if (field.defaultValue == null) {
          if (field.fieldType == "NUMBER") {
            field.defaultValue = 0;
          }
          if (field.fieldType == "BOOLEAN") {
            field.defaultValue = false;
          }
          if (field.fieldType == "TEXT") {
            field.defaultValue = null;
          }
          if (field.fieldType == "STREAM") {
            field.defaultValue = null;
          }
        }
      }
      if (id == undefined) {
        api.PRODUCT_CREATE(data).then((res) => {
          this.detail.visible = false;
          this.productList();
        });
      } else {
        api.PRODUCT_UPDATE(id, data).then((res) => {
          this.detail.visible = false;
          this.productList();
        });
      }
    },
    // ------模块-------
    // 打开产品模块
    showModule(id) {
      //
      const params = {
        productId: id,
        current: this.module.current,
        size: this.module.size,
      };
      console.log("show module");
      this.loading = true;
      this.$api
        .MODULE_LIST(params)
        .then((res) => {
          this.module.data = res.records;
          this.module.total = res.total;
          this.module.visible = true;
          this.module.productId = id;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    // --------设备-----------
    newDevice(productId) {
      if (!productId) {
        this.$message({
          message: "请选择产品",
          type: "error",
        });
      } else {
        this.device.data = {
          projectId: this.projectId,
          productId: productId,
          name: "",
          location: "",
          industry: "",
          model: "",
          createCount: 1,
          description: "",
        };
        this.device.visible = true;
      }
    },
    createDevice(data) {
      let _this = this;
      this.$api
        .DEVICE_CREATE(data)
        .then((res) => {
          if (res.id > 0) {
            _this.$message({
              message: "设备创建成功",
              type: "success",
            });
            _this.device.data = {};
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
    newSchedule(productId) {},
  },
};
</script>

<style lang='scss'>
.project-product-container {
  .box-card {
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
