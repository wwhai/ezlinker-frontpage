<template>
  <d2-container class="project-device-container">
    <el-card class="box-card" style="min-height:99%">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" :content="pageTitle"></el-page-header>
      </div>

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
          <el-input v-model="searchParam.industry" placeholder="厂家"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="device-table"
        :stripe="true"
        :data="devicePage.data"
        border
        v-loading="device.loading"
      >
        <el-table-column prop="sn" label="设备SN" width="200"></el-table-column>
        <el-table-column prop="name" label="设备名称"></el-table-column>
        <el-table-column prop="model" label="设备型号"></el-table-column>
        <el-table-column prop="industry" label="生产厂家"></el-table-column>
        <el-table-column prop="state" label="当前状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 1" type="success">在线</el-tag>
            <el-tag v-else type="warning">离线</el-tag>
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
                @click="deviceDetail(scope.row.id)"
              >详情</el-button>
              <!-- <el-button size="mini" plain type="primary">新建任务</el-button> -->
              <el-dropdown class="item">
                <span class="el-dropdown-link">
                  更多
                  <em class="el-icon-arrow-down el-icon--right"></em>
                </span>
                <el-dropdown-menu class slot="dropdown">
                  <el-dropdown-item icon="el-icon-help">
                    <span size="mini" @click="testCmdDialog.show = true" plain type="primary">指令测试</span>
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-paperclip">
                    <span size="mini" plain type="primary">下载密钥</span>
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-phone-outline">
                    <span @click="showScheduleDialog(scope.row.id)">调度任务</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;text-align:right">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="onCurrentPageChange"
          :current-page.sync="devicePage.current"
          :page-size="devicePage.size"
          :total="devicePage.total"
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
          <d2-icon name="plus" style="margin-right:8px" />添加任务
        </el-button>
        <el-table :data="schedule.list">
          <el-table-column label="任务名" prop="jobName" width="200px"></el-table-column>
          <el-table-column prop="state" label="当前状态" width="80px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" type="success">有效</el-tag>
              <el-tag v-else type="danger">停止</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="Cron表达式" width="180px" prop="cronExpression"></el-table-column>
          <el-table-column label="任务数据" prop="scheduleData"></el-table-column>
        </el-table>
      </div>
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
        :submit="editScheduleSubmit"
        :cancel="()=>{scheduleDetail.visible=false}"
      />
    </el-dialog>
    <!-- 测试指令 -->
    <el-dialog
      center
      title="测试指令"
      width="600px"
      class="schedule-edit-dialog"
      :visible.sync="testCmdDialog.show"
    >
      <el-form :model="testCmdDialog">
        <el-form-item label="指令内容">
          <el-input type="textarea" v-model="testCmdDialog.cmd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="testCmd()">发送指令</el-button>
          <el-button @click="testCmdDialog.cmd = ''">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </d2-container>
</template>

<script>
// /Users/wangwenhai/github/ezlinker-frontpage/src/views/resource/project/components/schedule/schedule.vue
import Schedule from "./components/schedule/schedule.vue";
import ScheduleEdit from "./components/schedule/schedule_edit.vue";

export default {
  name: "DeviceIndex",
  components: {
    Schedule,
    ScheduleEdit,
  },
  data() {
    return {
      // 页面头部标题
      pageTitle: "设备管理",
      // 多个结果用XXXRecords
      devicePage: {
        current: 1,
        size: 10,
        total: 0,
        pages: 0,
        data: [],
      },
      //搜索条件
      searchParam: {
        productId: this.$route.params.projectId,
        current: 1,
        size: 10,
        name: null,
        sn: null,
        model: null,
        industry: null,
      },
      projectId: 0,
      device: {
        current: 1,
        size: 10,
        total: 0,
        list: [],
        loading: false,
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
  created() {},
  mounted() {
    const params = {
      current: this.device.current,
      size: this.device.size,
    };
    this.getDeviceData(params);
  },
  methods: {
    goBack() {
      this.$router.push({ name: "project" });
    },
    //
    deviceDetail(id) {
      this.$router.push({
        name: "deviceDetail",
        params: { productId: this.productId, id: id },
      });
    },
    // -----调度任务------
    showScheduleDialog(id) {
      this.schedule.deviceId = id;
      this.schedule.visible = false;
      this.scheduleList();
    },
    scheduleList() {
      const params = {
        deviceId: this.schedule.deviceId,
        current: this.schedule.current,
        size: this.schedule.size,
      };
      this.schedule.visible = true;
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
          this.$message.error("拉取数据失败");
          this.schedule.loading = false;
        });
    },
    newSchedule() {
      this.scheduleDetail.data = {
        deviceId: this.schedule.deviceId,
        jobName: "",
        cronExpression: "",
        // 转为json
        scheduleData: '{"key":"value"}',
        description: "",
      };
      this.scheduleDetail.visible = true;
    },
    // editSchedule() {

    // },
    editScheduleSubmit(data) {
      if (data.id === undefined) {
        data.scheduleData = JSON.parse(data.scheduleData);
        console.log(data);
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
    // 分页事件响应
    onCurrentPageChange(currentPage) {
      this.searchParam.current = currentPage;
      this.getDeviceData(this.searchParam);
    },
    // 加载数据函数，命名规范：getXXXData(参数)
    // ！！！ 注意：在lambda表达式，this统一叫this；
    getDeviceData(param) {
      this.$api
        .DEVICE_QUERY_FOR_PAGE(param)
        .then((res) => {
          //
          this.devicePage.data = res.records;
          this.devicePage.current = res.current;
          this.devicePage.size = res.size;
          this.devicePage.total = res.total;
          this.devicePage.pages = res.pages;
          //
          this.searchParam.size = res.size;
        })
        .catch((err) => {
          console.log(error);
        });
    },
    // 条件检索
    search() {
      this.getDeviceData(this.searchParam);
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