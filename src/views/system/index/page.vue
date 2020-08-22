<template>
  <d2-container class="home-page">
    <div class="stat">
      <div class="stat-item">
        <div class="meta">
          <div class="title">用户总数</div>
          <div class="count">{{stat.users}}</div>
        </div>
        <div class="icon">
          <d2-icon name='user-o'></d2-icon>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">项目总数</div>
          <div class="count">{{stat.projects}}</div>
        </div>
        <div class="icon">
          <d2-icon name='list-ul'></d2-icon>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">产品总数</div>
          <div class="count">{{stat.products}}</div>
        </div>
        <div class="icon">
          <d2-icon name='hdd-o'></d2-icon>
        </div>
      </div>
      <div class="stat-item">
        <div class="meta">
          <div class="title">设备总数</div>
          <div class="count">{{stat.devices}}</div>
        </div>
        <div class="icon">
          <d2-icon name='credit-card'></d2-icon>
        </div>
        </div>
    </div>
    <div class="chart">
      <div class="left">
        <div class="box">
          <div class="title">系统负载</div>
          <ve-line :data="chart.system" ></ve-line>
        </div>
      </div>
      <div class="right">
        <div class="box">
          <div class="title">网络IO</div>
          <ve-line :data="chart.io" ></ve-line>
        </div>
      </div>
    </div>
  <!-- emq节点状态 -->
    <div class="nodes">
      <div class="title">EMQ节点</div>
      <el-table v-loading="emq.loading" class="nodes-table"
        :data="emq.list" style="width: 100%">
        <!-- 扩展列 -->
        <el-table-column type="expand">
          <!-- slot-scope="props" -->
          <template>
            <div class="expand-list">
              <div class="item">
                <span class="title">1/5/15分钟平均负载:</span>
                <span class="content">  0.0/0.0/0.0</span>
              </div>
              <div class="item">
                <span class="title">24h内负载:</span>
                <span class="content">暂无</span>
              </div>
              <div class="item">
                <span class="title">内存使用:</span>
                <span class="content">暂无</span>
              </div>
            </div>
            </template>
        </el-table-column>
        <!-- 其他列 -->
        <el-table-column prop="nodeName" label="节点名称" >
        </el-table-column>
        <el-table-column prop="description" label="节点描述">
        </el-table-column>
        <el-table-column label="运行状态">
          <template slot-scope="scope">
            <template v-if="scope.row.state==1||scope.row.state==0">
              <el-tag v-if="scope.row.state==1">在线</el-tag>
              <el-tag v-else type="danger">离线</el-tag>
            </template>
            <template v-else>未知</template>
          </template>
        </el-table-column>
        <el-table-column
          label="连接数">
          <template >
            - - -, - - -
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="运行时间">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
      </el-table>
    </div>
    <!-- 日志 -->
    <div class="log">
      <!-- 设备上下线日志 -->
      <div class="log-item device-log">
        <div class="title">设备上下线日志</div>
        <el-table :data="deviceLog.list" style="width: 100%" v-loading="deviceLog.loading">
          <el-table-column prop="date"
            label="编号" width="80">
          </el-table-column>
          <el-table-column prop="name"
            label="设备名" width="80">
          </el-table-column>
          <el-table-column
            prop="address" label="模块">
          </el-table-column>
          <el-table-column
            prop="address" label="事件">
          </el-table-column>
          <el-table-column
            prop="address" label="时间">
          </el-table-column>
        </el-table>
      </div>
      <!-- 登录日志 -->
      <div class="log-item login-log">
        <div class="title">登录日志</div>
        <el-table :data="userLog.list" style="width: 100%">
          <el-table-column
            prop="username"
            label="用户" width="80">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            width="80">
          </el-table-column>
          <el-table-column
            prop="location"
            label="地址">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </d2-container>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      stat: {
        devices: 0,
        products: 0,
        projects: 0,
        users: 0
      },
      chart: {
        system: {
          columns: ['日期', 'memory', 'cpu'],
          rows: []
        },
        io: {
          columns: ['日期', 'in', 'out'],
          rows: []
        }
      },
      emq: {
        list: [],
        loading: false
      },
      userLog: {
        list: [],
        loading: false
      },
      deviceLog: {
        list: [],
        loading: false
      }
    }
  },
  mounted () {
    this.getStat()
    this.getEMQ()
    this.getUserLog()
    this.getDeviceLog()
    this.getSystemInfo()
    this.getNetworkRunning()
  },
  methods: {
    getStat () {
      const that = this
      that.$api.OVER_VIEW().then(res => {
        that.stat = res
      })
    },
    getEMQ () {
      const that = this
      that.emq.loading = true
      that.$api.EMQX_ALL().then(res => {
        console.log('emq', res)
        // const list
        that.emq.list = res
        that.emq.loading = false
      }).catch(err => {
        that.emq.loading = false
      })
    },
    getUserLog () {
      const that = this
      const params = {
        current: 1,
        size: 10
      }
      that.userLog.loading = true
      that.$api.USER_LOG(params).then(res => {
        that.userLog.list = res.records
        that.userLog.loading = false
      }).catch(err => {
        that.userLog.loading = false
      })
    },
    getDeviceLog () {
      const that = this
      const params = {
        current: 1,
        size: 10
      }
      that.userLog.loading = true
      that.$api.MODULE_LOGS(params).then(res => {
        that.userLog.list = res.records
        that.userLog.loading = false
      }).catch(err => {
        that.userLog.loading = false
      })
    },
    getSystemInfo () {
      const that = this
      // const date =
      // 心跳获取系统负载信息
      setInterval(() => {
        that.$api.EZLINKER_INFO().then(res => {
          const rows = []
          const len = that.chart.system.rows.length
          const start = len - 19
          for (var i = start >= 0 ? start : 0; i < len; i++) {
            rows.push(that.chart.system.rows[i])
          }
          rows.push({
            日期: new Date().toLocaleTimeString(),
            memory: 100 * ((res.memory.total - res.memory.free) / res.memory.total),
            cpu: 100 * res.cpuLoad
          })

          that.chart.system.rows = rows
        }).catch(err => {

        })
      }, 5000)
    },
    getNetworkRunning () {
      const that = this
      that.$api.NETWORK_RUNNING().then(res => {
        console.log('io', res)
        var rows = []
        for (var i = 0; i < res.createTime.length; i++) {
          rows.push({
            日期: res.createTime[i],
            in: res.netWorkIn[i],
            out: res.netWorkOut[i]
          })
        }
        that.chart.io.rows = rows
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page{
  .stat{
    display: flex;
    justify-content: space-between;
    .stat-item{
      padding: 10px;
      padding-top: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      display: flex;
      justify-content: space-between;
      width: 25%;
      .meta{
        .title{
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
        .count{
          margin-top: 6px;
          font-size: 30px;
        }
      }
      .icon{
        padding: 6px;
        font-size: 42px;
        .fa{
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .stat-item + .stat-item{
      margin-left: 40px;
    }
  }
  .chart{
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .left, .right{
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      width: 48%;
      // padding-bottom: 10px;
      text-align: center;
      .box{
        padding: 10px;
      }
    }
    .left{
    }
    .right{
      // margin-left: 40px;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      // width: 50%;
    }
  }
  .nodes{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-top: 30px;
    .title{
      padding: 6px;
      padding-top: 10px;
    }
    .el-table{
      border-top: 1px solid #eee;
      .expand-list{
        display: flex;
        .item{
          .title{
            font-weight: 700;
            color: #888;
          }
          .content{
            margin-left: 6px;
          }
        }
        .item + .item{
          margin-left: 20px;
        }
      }
    }
  }

  .log{
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .log-item {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      width: 48%;
      .title{
        padding: 6px;
        padding-top: 10px;
        color: #777;
      }
      .el-table{
        border-top: 1px solid #eee;
      }
    }
    .log-item + .log-item{
      // margin-left: 40px;
    }
  }
}
</style>
