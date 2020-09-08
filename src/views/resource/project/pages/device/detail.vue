<template>
  <d2-container class="device-detail-container">
    <el-card class="box-card">
      <el-page-header slot="header" @back="goBack" :content="pageTitle" />
      <div class="meta" v-loading="device.loading">
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
    <!-- 状态 -->
    <el-row :gutter="24">
      <el-col :span="24">
        <div>
          <el-card style="padding-bottom:30px;">
            <div slot="header" class="clearfix">
              <span>设备运行状态</span>
            </div>
            <el-col v-for="item in device.state" :key="item" :span="8">
              <el-card shadow="never" style="margin-bottom:10px;text-align:center;">
                <div style>
                  <el-row>
                    <el-col :span="24">
                      <div style="font-size:20px;color:#409EFF;">{{item.description}}</div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div style="font-size:34px;color:#F56C6C;">{{item.value}}-{{item.unit}}</div>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- --- -->
    <!-- 模块 -->
    <el-row :gutter="24">
      <el-col :span="24">
        <div>
          <el-card style="padding-bottom:30px;">
            <div slot="header" class="clearfix">
              <span>模块列表</span>
            </div>
            <!-- 模块数据表 -->
            <el-table :stripe="true" :data="device.modules" border>
              <el-table-column prop="name" width="120px" label="图标">
                <template slot-scope="scope">
                  <el-image style="width: 100px; height: 100px" :src="scope.row.icon" :fit="fit"></el-image>
                </template>
              </el-table-column>

              <el-table-column prop="name" width="200px" label="详细信息">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="6">
                      <div style="font-weight: bold;">名称:</div>
                    </el-col>
                    <el-col :span="18">
                      <div>{{scope.row.name}}</div>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="6">
                      <div style="font-weight: bold;">型号:</div>
                    </el-col>
                    <el-col :span="18">
                      <div>{{scope.row.model}}</div>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="6">
                      <div style="font-weight: bold;">类型:</div>
                    </el-col>
                    <el-col :span="18">
                      <div>{{scope.row.type}}</div>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="当前状态">
                <template slot-scope="scope"></template>
              </el-table-column>
            </el-table>
            <!-- ---模块 end -->
          </el-card>
        </div>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
export default {
  name: "device-detail",
  data() {
    return {
      pageTitle: "设备详情",
      id: -1, // deviceId
      device: {
        data: {},
        state: [
          {
            type: "NUMBER",
            unit: "^C",
            field: "temp",
            description: "温度",
            value: 30,
          },
          {
            type: "NUMBER",
            unit: "%",
            field: "hum",
            description: "湿度",
            value: 100,
          },
          {
            type: "NUMBER",
            unit: "Lex",
            field: "lex",
            description: "光照强度",
            value: 25,
          },
          {
            type: "NUMBER",
            unit: "Vol",
            field: "co2",
            description: "二氧化碳",
            value: 25,
          },
        ],
        loading: false,
        //模块
        modules: [],
      },
    };
  },
  mounted() {
    this.deviceId = this.$route.params.deviceId;
    this.getDeviceInfo();
    this.getModules();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取模块列表
    getModules() {
      this.$api
        .MODULE_QUERY_FOR_PAGE({ deviceId: this.deviceId })
        .then((res) => {
          this.device.modules = res.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取状态
    getDeviceState() {},
    // 获取设备详情
    getDeviceInfo() {
      this.device.loading = true;
      this.$api
        .DEVICE_INFO(this.deviceId)
        .then((res) => {
          this.device.data = res;
          this.device.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.device.loading = false;
        });
    },
  },
};
</script>

<style lang='scss'>
.device-detail-container {
  .box-card + .box-card {
    margin-top: 20px;
  }
  .meta {
    display: flex;
    .logo {
      width: 100px;
      height: 100px;
      padding-right: 20px;
      img {
        width: 100%;
      }
    }
    .info {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      line-height: 30px;
      .item {
        width: 25%;
        display: flex;
        .label {
          padding-right: 4px;
          font-weight: bold;
          color: #303133;
          &::after {
            content: ":";
          }
        }
        .value {
          word-break: break-all;
        }
      }
    }
  }
}
</style>