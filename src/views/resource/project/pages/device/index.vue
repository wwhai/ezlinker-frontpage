<template>
  <d2-container class="project-device-container">
    <el-card class="box-card" style="min-height: 99%">
      <el-page-header slot="header" @back="goBack" :content="pageTitle" />

      <!-- 搜索条件 -->
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="设备SN">
          <el-input v-model="searchParam.sn" placeholder="SN"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchParam.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="searchParam.model" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item label="厂家">
          <el-input
            v-model="searchParam.industry"
            placeholder="厂家"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- device 数据表 -->
      <el-table
        class="device-table"
        :stripe="true"
        :data="devicePage.data"
        border
        height="600px"
        v-loading="devicePage.loading"
      >
        <el-table-column prop="sn" label="设备SN" width="200"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="model" label="设备型号"></el-table-column>
        <el-table-column prop="industry" label="生产厂家"></el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.state == 'ONLINE'">
              <i
                class="fa fa-check"
                aria-hidden="true"
                style="margin-right: 6px"
              ></i>
            </div>
            <div v-else>
              <i
                class="fa fa-close"
                aria-hidden="true"
                style="margin-right: 6px"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="生产日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tool">
              <el-button
                class="item"
                size="mini"
                plain
                type="primary"
                @click="toDeviceDetail(scope.row.id)"
                >详情</el-button
              >
              <!-- <el-button size="mini" plain type="primary">新建任务</el-button> -->
              <el-dropdown class="item">
                <span class="el-dropdown-link">
                  更多
                  <em class="el-icon-arrow-down el-icon--right"></em>
                </span>
                <el-dropdown-menu class slot="dropdown">
                  <el-dropdown-item icon="el-icon-thumb">
                    <span
                      size="mini"
                      plain
                      type="primary"
                      @click="downloadSdkDialog.visible = true"
                      >下载SDK</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-download">
                    <span
                      size="mini"
                      plain
                      type="primary"
                      @click="downloadAuthFile(scope.row.clientId)"
                      >下载凭据</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-set-up">
                    <span @click="showScheduleDialog(scope.row.id)"
                      >调度任务</span
                    >
                  </el-dropdown-item>

                  <el-dropdown-item icon="el-icon-connection">
                    <span @click="forceKickout(scope.row.clientId)"
                      >强制重连</span
                    >
                  </el-dropdown-item>

                  <el-dropdown-item icon="el-icon-delete">
                    <span @click="removeDevice(scope.row.id)">删除设备</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: right">
        <el-pagination
          background
          :current-page.sync="devicePage.current"
          :page-size="devicePage.size"
          :total="devicePage.total"
          layout="total, prev, pager, next"
          @current-change="deviceListPagenation"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 调度任务 -->
    <el-dialog
      title="调度任务"
      width="1000px"
      class="schedule-edit-dialog"
      :visible.sync="schedule.visible"
    >
      <div class="tool">
        <el-button type="primary" @click="newSchedule">
          <d2-icon name="plus" style="margin-right: 8px" />添加任务
        </el-button>
      </div>
      <el-table :data="schedule.list">
        <el-table-column
          label="任务名"
          prop="jobName"
          width="200px"
        ></el-table-column>
        <el-table-column prop="state" label="当前状态" width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">有效</el-tag>
            <el-tag v-else type="danger">停止</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column
          label="Cron表达式"
          width="180px"
          prop="cronExpression"
        ></el-table-column>
        <el-table-column label="任务数据" prop="scheduleData">
          <template slot-scope="scope">{{ scope.row.scheduleData }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        layout="prev, pager, next"
        :current-page.sync="schedule.current"
        :page-size="schedule.size"
        :total="schedule.total"
      ></el-pagination>
    </el-dialog>

    <!-- 添加任务 -->
    <el-dialog
      title="添加任务"
      width="600px"
      class="schedule-edit-dialog"
      :visible.sync="scheduleDetail.visible"
    >
      <schedule-edit
        :data="scheduleDetail.data"
        :submit="submitSchedule"
        :cancel="
          () => {
            scheduleDetail.visible = false;
          }
        "
      />
    </el-dialog>
    <!-- 下载SDK -->
    <el-dialog
      title="下载SDK"
      width="600px"
      :visible.sync="downloadSdkDialog.visible"
    >
      目前暂时没有时间开发这部分内容,后续版本支持一键下载SDk.
      <el-tabs :value="'1'">
        <el-tab-pane label="LinuxC/C++" name="1">
          文档:https://docs.emqx.io/broker/latest/en/development/c.html
        </el-tab-pane>
        <el-tab-pane label="Python" name="2"
          >文档:https://docs.emqx.io/broker/latest/en/development/python.html</el-tab-pane
        >
        <el-tab-pane label="Java" name="3"
          >文档:https://docs.emqx.io/broker/latest/en/development/java.html
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </d2-container>
</template>

<script>
// 注意：这里的路径
import Schedule from "../../components/schedule/schedule.vue";
import ScheduleEdit from "../../components/schedule/schedule_edit.vue";

export default {
  name: "DeviceIndex",
  components: {
    Schedule,
    ScheduleEdit,
  },
  data() {
    return {
      //
      downloadSdkDialog: { visible: false },
      // 页面头部标题
      pageTitle: "设备管理",
      projectId: null,
      timers: [],
      devicePage: {
        current: 1,
        size: 10,
        total: 0,
        pages: 0,
        data: [],
      },
      //搜索条件
      searchParam: {
        productId: 0,
        current: 1,
        size: 30,
        name: null,
        sn: null,
        model: null,
        industry: null,
      },
      schedule: {
        deviceId: 0,
        list: [],
        current: 1,
        size: 10,
        total: 0,
        visible: false,
      },
      scheduleDetail: {
        data: {},
        visible: false,
      },
      //
      testCmdDialog: {
        show: false,
        cmd: "",
        deviceId: -1,
      },
    };
  },
  destroyed() {
    for (let index = 0; index < this.timers.length; index++) {
      clearInterval(this.timers[index]);
    }
  },
  mounted() {
    let projectId = this.$route.params.projectId;
    let productId = this.$route.params.productId;

    if (projectId == 0) {
      this.projectId = null;
    } else {
      this.projectId = projectId;
    }
    if (productId == 0) {
      this.productId = null;
    } else {
      this.productId = productId;
    }
    this.getDeviceList();
    this.getDeviceState();
    let id = setInterval(this.getDeviceState, 2000);
    this.timers.push(id);
  },
  methods: {
    goBack() {
      this.$router.push({ name: "project" });
    },
    // 删除设备
    removeDevice(deviceId) {
      this.$confirm("此操作将永久删除设备的所有信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .REMOVE_DEVICE([deviceId])
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getDeviceList();
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
    //
    downloadAuthFile(clientId) {
      window.open("devices/downloadAuthFile?clientId=" + clientId);
    },
    // 下载SDK
    downloadSdk(id) {},
    //强制重连
    forceKickout(clientId) {
      this.$api
        .FORCE_OFFLINE(clientId)
        .then((res) => {
          this.$message.success(res.message);
        })
        .catch((err) => {});
    },
    //
    toDeviceDetail(id) {
      this.$router.push({
        name: "device-detail",
        params: { deviceId: id, projectId: this.projectId },
      });
    },
    // -----调度任务------
    showScheduleDialog(id) {
      this.schedule.deviceId = id;
      this.schedule.visible = true;
      this.getScheduleList();
    },
    //获取设备的状态
    getDeviceState() {
      let deviceData = this.devicePage.data;
      let ids = [];
      for (let item of deviceData) {
        ids.push(item.clientId);
      }
      this.$api
        .DEVICE_ONLINE_STATE(ids)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].clientId == deviceData[i].clientId) {
              deviceData[i].state = res[i].state;
            }
          }
          this.devicePage.data = deviceData;
        })
        .catch((err) => {});
    },
    getScheduleList() {
      //
      const params = {
        deviceId: this.schedule.deviceId,
        current: this.schedule.current,
        size: this.schedule.size,
      };
      this.schedule.visible = true;
      //FIXME 接口请求出错
      this.schedule.loading = true;
      this.$api
        .SCHEDULE_QUERY_FOR_PAGE(params)
        .then((res) => {
          this.schedule.list = res.records;
          this.schedule.total = res.total;
          this.schedule.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.schedule.loading = false;
        });
    },
    //
    newSchedule() {
      this.scheduleDetail.data = {
        deviceId: this.schedule.deviceId,
        jobName: "",
        cronExpression: "",
        // 转为json
        scheduleData: '{"key":"value"}',
        description: "",
      };
      this.schedule.visible = false;
    },
    submitSchedule(data) {
      //
      if (data.id === undefined) {
        data.scheduleData = JSON.parse(data.scheduleData);
        this.$api
          .SCHEDULE_CREATE(data)
          .then((res) => {
            this.$message.success("创建成功");
            this.scheduleDetail.visible = false;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("添加任务出错");
          });
      }
    },
    //
    getDeviceList(searchParam) {
      let productId = this.$route.params.productId;
      if (productId == undefined) {
        productId = null;
      }
      let projectId = this.$route.params.projectId;
      if (projectId == undefined) {
        projectId = null;
      }
      const params = {
        ...searchParam,
        productId: productId,
        projectId: projectId,
        current: this.devicePage.current,
        size: this.devicePage.size,
      };
      this.$api
        .DEVICE_QUERY_FOR_PAGE(params)
        .then((res) => {
          this.devicePage.data = res.records;
          this.devicePage.current = res.current;
          this.devicePage.total = res.total;
          this.devicePage.pages = res.pages;
          this.getDeviceState();
        })
        .catch((err) => {
          console.log(error);
        });
    },
    deviceListPagenation(current) {
      this.deviceList.current = current;
      this.getDeviceList();
    },
    // 条件检索
    search() {
      console.log("Search:", this.searchParam);
      this.getDeviceList(this.searchParam);
    },
    //
    testCmd(data) {
      this.$message({
        message: "测试成功",
        type: "success",
      });
    },
  },
};
</script>

<style lang='scss'>
.project-device-container {
  .device-table {
    .tool {
      .item {
        margin-right: 8px;
      }
      span {
        cursor: pointer;
        padding-right: 6px;
        a {
          color: #606266;
        }
      }
    }
  }
}
</style>