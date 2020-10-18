<template>
  <d2-container class="producct-detail-container">
    <el-card class="box-card" style="min-height: 99%">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="产品详情"></el-page-header>
      </div>

      <div class="product-wrapper">
        <div class="box product-box" v-loading="detail.loading">
          <!-- <div class="title">产品信息</div> -->
          <div class="list detail-box">
            <div class="item device-count">
              <div class="title">设备数量</div>
              <div class="content">
                {{ detail.data.deviceCount ? detail.data.deviceCount : 0 }}
              </div>
            </div>
            <div class="meta-box">
              <div class="item">
                <div class="title">产品名称:</div>
                <div class="content">{{ detail.data.name }}</div>
              </div>
              <div class="item">
                <div class="title">产品类型:</div>
                <div class="content">
                  {{ detail.data.type == 1 ? "通用" : "未知" }}
                </div>
              </div>
              <div class="item">
                <div class="title">创建时间:</div>
                <div class="content">
                  {{ new Date(detail.data.createTime) }}
                </div>
              </div>

              <div class="item">
                <div class="title">产品描述:</div>
                <div class="content">{{ detail.data.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="expand-box">
          <div class="box param-box" v-loading="detail.loading">
            <div class="wrapper param">
              <div class="title">产品参数</div>
              <div class="list param-list">
                <el-table
                  :data="detail.data.fieldParams"
                  size="medium"
                  max-height="100%"
                >
                  <el-table-column prop="field" label="字段"></el-table-column>

                  <el-table-column prop="fieldType" label="类型">
                    <template slot-scope="scope">
                      <span v-if="scope.row.fieldType == 'NUMBER'">数值</span>
                      <span v-if="scope.row.fieldType == 'TEXT'">纯文本</span>
                      <span v-if="scope.row.fieldType == 'BOOLEAN'"
                        >布尔值</span
                      >
                      <span v-if="scope.row.fieldType == 'STREAM'">流媒体</span>
                      <span v-if="scope.row.fieldType == 'GEO'">地理坐标</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="defaultValue"
                    label="默认值"
                  ></el-table-column>

                  <el-table-column
                    prop="description"
                    label="描述"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
import { ProtoToStr, FieldTypeToStr } from "@/libs/const";
import API from "@/api";
export default {
  name: "producct-detail",
  data() {
    return {
      productId: 0,
      detail: {
        data: {},
        loading: false,
      },
      module: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
        loading: false,
      },
    };
  },
  mounted() {
    this.projectId = this.$route.params.projectId;
    this.productId = this.$route.params.productId;
    this.getProductDetail();
  },

  methods: {
    goBack() {
      this.$router.push({
        name: "project-product",
        params: {
          projectId: this.$route.params.projectId,
          productId: this.$route.params.productId,
        },
      });
    },
    typeToStr(index) {
      return FieldTypeToStr(index);
    },
    protoToStr(index) {
      return ProtoToStr(index);
    },
    //
    getProductDetail() {
      this.detail.loading = true;
      this.$api
        .PRODUCT_INFO(this.productId)
        .then((res) => {
          this.detail.data = res;
          this.detail.loading = false;
        })
        .catch((err) => {
          this.detail.loading = false;
        });
    },
  },
};
</script>

<style lang='scss'>
.producct-detail-container {
  .product-wrapper {
    height: 100%;
    // display: flex;
    flex-flow: column;
    .box {
      // width: 60%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      & > .title {
        color: rgba(0, 0, 0, 0.65);
        font-weight: 700;
        font-size: 16px;
        line-height: 1.5715;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & > .list {
        margin-top: 10px;
        font-size: 14px;
      }
    }
    .product-box {
      padding: 24px;
      height: 80px;
      .detail-box {
        display: flex;
        .device-count {
          width: 80px;
          text-align: center;
          border-right: 1px solid #ddd;
          margin-right: 30px;
          // margin-right: 20px;
          // padding: 10px 0;
          padding-right: 20px;
          .title {
            font-weight: 700;
            color: #666;
          }
          .content {
            color: rgba(0, 0, 0, 0.65);
            margin-top: 10px;
            font-size: 28px;
          }
        }
        .meta-box {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          .item {
            // margin-right: 50px;
            margin-bottom: 18px;
            line-height: 20px;
            width: 25%;
            .title {
              margin-right: 10px;
              width: 70px;
              float: left;
              color: rgba(0, 0, 0, 0.85);
            }
            .content {
              word-wrap: break-word;
              word-break: break-all;
              overflow: hidden;
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
      }
    }
    .protocol-box {
      margin-top: 20px;
      min-height: 120px;
      padding: 20px;
      .title {
        line-height: 20px;
        width: 80px;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 700;
      }
      .protocol-tabs {
      }
    }
    .expand-box {
      margin-top: 20px;
      // height: 100%;
      // flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .wrapper {
        padding: 24px;
      }
      .param-box {
        width: 58%;
        // padding-right: 20px;
        // margin-right: 40px;
        .title {
          line-height: 20px;
          width: 80px;
          color: rgba(0, 0, 0, 0.65);
          font-weight: 700;
        }
        .param-list {
          margin-top: 10px;
          word-break: break-all;
          overflow: hidden;
          font-size: 16px;
          .el-table {
            font-size: 16px;
          }
        }
      }
      .module-box {
        // margin-top: 30px;
        width: 40%;
        .title {
          color: rgba(0, 0, 0, 0.65);
          font-weight: 700;
        }
        .module-list {
          margin-top: 10px;
          .module-table {
            .icon {
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
