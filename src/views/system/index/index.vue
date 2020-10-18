<template>
  <d2-container class="home-page">
    <div class="stat">
      <div class="stat-item">
        <div class="meta">
          <div class="title">用户总数</div>
          <div class="count">{{ overViewData.users }}</div>
        </div>
        <div class="icon">
          <i
            onmouseover="this.style.color='#00BFFF'"
            onmouseout="this.style.color='#000000'"
            class="fa fa-address-card"
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">项目总数</div>
          <div class="count">{{ overViewData.projects }}</div>
        </div>
        <div class="icon">
          <i
            onmouseover="this.style.color='#00BFFF'"
            onmouseout="this.style.color='#000000'"
            class="fa fa-object-group"
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">产品总数</div>
          <div class="count">{{ overViewData.products }}</div>
        </div>
        <div class="icon">
          <i
            onmouseover="this.style.color='#00BFFF'"
            onmouseout="this.style.color='#000000'"
            class="fa fa-th-list"
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">离线设备</div>
          <div class="count">
            <span>{{ overViewData.devices }}</span>
          </div>
        </div>
        <div class="icon">
          <i
            onmouseover="this.style.color='#00BFFF'"
            onmouseout="this.style.color='#000000'"
            class="fa fa-deaf"
            aria-hidden="true"
          ></i>
        </div>
      </div>

      <div class="stat-item">
        <div class="meta">
          <div class="title">在线设备</div>
          <div class="count">
            <span>{{ overViewData.onlineCount }}</span>
          </div>
        </div>
        <div class="icon">
          <i
            onmouseover="this.style.color='#00BFFF'"
            onmouseout="this.style.color='#000000'"
            class="fa fa-microchip"
            aria-hidden="true"
          ></i>
        </div>
      </div>
    </div>
    <!-- emq节点状态 -->
    <div class="nodes">
      <div class="title">EMQ节点</div>
      <el-table
        v-loading="emq.loading"
        default-expand-all="true"
        class="nodes-table"
        :data="emq.list"
        style="width: 100%"
      >
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expand-list">
              <div class="item">
                <span class="title">MQTT端口:</span>
                <span class="content">{{ scope.row.mqttPort }}</span>
              </div>
              <div class="item">
                <span class="title">API端口:</span>
                <span class="content">{{ scope.row.mqttPort }}</span>
              </div>
              <div class="item">
                <span class="title">版本:</span>
                <span class="content" v-if="scope.row.detail != null">{{
                  scope.row.detail.version
                }}</span>
                <span class="content" v-else>未知</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 其他列 -->
        <el-table-column prop="nodeName" label="节点名称"></el-table-column>
        <el-table-column label="运行状态">
          <template slot-scope="scope">
            <i
              onmouseover="this.style.color='#00BFFF'"
              onmouseout="this.style.color='#000000'"
              v-if="scope.row.detail != null"
              class="fa fa-cog fa-spin fa-3x fa-fw"
            ></i>
            <i v-else class="fa fa-stop-circle-o"></i>
          </template>
        </el-table-column>
        <el-table-column label="节点版本">
          <template slot-scope="scope">
            <div v-if="scope.row.detail != null">
              {{ scope.row.detail.version }}
            </div>
            <el-tag v-else type="danger">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="运行时间">
          <template slot-scope="scope">
            <div v-if="scope.row.detail != null">
              {{ scope.row.detail.uptime }}
            </div>
            <div v-else type="danger">离线</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 日志 -->
    <div class="log">
      <!-- 设备上下线日志 -->
      <div class="log-item device-log">
        <div class="title">设备上下线日志</div>
        <el-table
          height="600px"
          :data="deviceLog.data"
          style="width: 100%"
          v-loading="deviceLog.loading"
        >
          <!-- <el-table-column prop="clientId" label="设备ID"></el-table-column> -->
          <el-table-column prop="type" label="类型" width="90px">
            <template slot-scope="scope">
              <div v-if="scope.row.type == 'ONLINE'">
                <i
                  class="fa fa-check"
                  aria-hidden="true"
                  style="margin-right: 6px"
                ></i>
              </div>
              <div v-else-if="scope.row.type == 'OFFLINE'">
                <i
                  class="fa fa-close"
                  aria-hidden="true"
                  style="margin-right: 6px"
                ></i>
              </div>
              <div v-else>
                <i
                  style="margin-right: 6px"
                  class="fa fa-exclamation-triangle"
                  aria-hidden="true"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
            width="160px"
          ></el-table-column>
          <el-table-column prop="detail" label="详情"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px"
          backg
          layout="total, prev, pager, next"
          :current-page.sync="deviceLog.current"
          :page-size="deviceLog.size"
          :total="deviceLog.total"
          @current-change="deviceLogPagenation"
        ></el-pagination>
        <!-- ===== -->
      </div>
      <!-- 登录日志 -->
      <div class="log-item login-log">
        <div class="title">登录日志</div>
        <el-table height="600px" :data="userLog.data" style="width: 100%">
          <el-table-column prop="username" label="用户" width="80">
            <template slot-scope="scope">
              <i class="fa fa-user-o" aria-hidden="true"></i
              >{{ " " + scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP" width="150"></el-table-column>
          <el-table-column
            prop="location"
            width="200"
            label="地址"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            width="150"
            label="时间"
          ></el-table-column>
        </el-table>

        <el-pagination
          style="margin-top: 20px"
          backg
          layout="total, prev, pager, next"
          :current-page.sync="userLog.current"
          :page-size="userLog.size"
          :total="userLog.total"
          @current-change="userLogPagenation"
        ></el-pagination>
      </div>
    </div>
  </d2-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      timers: [],
      overViewData: {
        devices: 0,
        products: 0,
        projects: 0,
        users: 0,
      },
      emq: {
        list: [],
        loading: false,
      },
      userLog: {
        loading: false,
        data: [],
        current: 0,
        size: 20,
        total: 0,
      },
      deviceLog: {
        data: [],
        current: 0,
        size: 20,
        total: 0,
      },
    };
  },
  destroyed() {
    for (let index = 0; index < this.timers.length; index++) {
      clearInterval(this.timers[index]);
    }
  },
  mounted() {
    this.getOverViewData();
    let id1 = setInterval(this.getOverViewData, 2000);
    this.timers.push(id1);

    this.getEmqxState();
    let id2 = setInterval(this.getEmqxState, 2000);
    this.timers.push(id2);

    this.getUserLog();
    this.getDeviceLog();
  },
  methods: {
    userLogPagenation(currentRow) {
      this.userLog.current = currentRow;
      this.getUserLog();
    },
    deviceLogPagenation(currentRow) {
      this.deviceLog.current = currentRow;
      this.getDeviceLog();
    },
    getOverViewData() {
      this.$api.OVER_VIEW().then((res) => {
        this.overViewData = res;
      });
    },
    getOnlineCount() {
      this.$api
        .ONLINE_COUNT()
        .then((res) => {
          this.overViewData.onlineCount = res;
        })
        .catch((err) => {});
    },
    getEmqxState() {
      this.$api
        .EMQX_ALL()
        .then((res) => {
          this.emq.list = res;
        })
        .catch((err) => {});
    },

    getUserLog() {
      //
      let params = {
        current: this.userLog.current,
        size: this.userLog.size,
      };
      this.userLog.loading = true;
      this.$api
        .USER_LOG(params)
        .then((res) => {
          this.userLog.data = res.records;
          this.userLog.total = res.total;
          this.userLog.loading = false;
        })
        .catch((err) => {
          this.userLog.loading = false;
        });
    },
    // 设备的Log
    getDeviceLog() {
      //
      let params = {
        current: this.deviceLog.current,
        size: this.deviceLog.size,
      };
      this.deviceLog.loading = true;
      this.$api
        .DEVICE_LOGS(params)
        .then((res) => {
          this.deviceLog.data = res.records;
          this.deviceLog.total = res.total;
          this.deviceLog.loading = false;
        })
        .catch((err) => {
          this.deviceLog.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  .stat {
    display: flex;
    justify-content: space-between;
    .stat-item {
      padding: 10px;
      padding-top: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      width: 25%;
      .meta {
        .title {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
        .count {
          margin-top: 6px;
          font-size: 30px;
        }
      }
      .icon {
        padding: 6px;
        font-size: 42px;
        .fa {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .stat-item + .stat-item {
      margin-left: 40px;
    }
  }
  .chart {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .left,
    .right {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      width: 48%;
      // padding-bottom: 10px;
      text-align: center;
      .box {
        padding: 10px;
      }
    }
    .left {
    }
    .right {
      // margin-left: 40px;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      // width: 50%;
    }
  }
  .nodes {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    margin-top: 30px;
    .title {
      padding: 6px;
      padding-top: 10px;
    }
    .el-table {
      border-top: 1px solid #eee;
      .expand-list {
        display: flex;
        .item {
          .title {
            font-weight: 700;
            color: #888;
          }
          .content {
            margin-left: 6px;
          }
        }
        .item + .item {
          margin-left: 20px;
        }
      }
    }
  }

  .log {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .log-item {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      width: 48%;
      .title {
        padding: 6px;
        padding-top: 10px;
        color: #777;
      }
      .el-table {
        border-top: 1px solid #eee;
      }
    }
    .log-item + .log-item {
      // margin-left: 40px;
    }
  }
}
</style>
