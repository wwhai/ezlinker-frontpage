<template>
  <d2-container class="project-device-container">
    <el-card class="box-card" style="height:99%">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="设备列表"></el-page-header>
      </div>
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="查询设备">
          <el-input v-model="searchParam.user" placeholder="名称/型号/SN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table class="device-table" :stripe="true" :data="device.list" border >
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
            <el-button class="item" size="mini" plain type="primary" @click="handle(scope.row)">详情</el-button>
            <!-- <el-button size="mini" plain type="primary">新建任务</el-button> -->
            <el-dropdown class="item">
              <span class="el-dropdown-link">
                更多<em class="el-icon-arrow-down el-icon--right"></em>
              </span>
              <el-dropdown-menu class="" slot="dropdown">
                <el-dropdown-item icon="el-icon-help">
                  <span size="mini" plain type="primary">指令测试</span>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-paperclip">
                  <span size="mini" plain type="primary">下载密钥</span>
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-phone-outline">
                  <span @click="openSchedule(scope.row.id)">调度任务</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;">
        <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
      </div>
    </el-card>
    <!-- 调度任务 -->
    <el-dialog title="调度任务" width="600px" class="schedule-edit-dialog"
      :visible.sync="schedule.visible">
      <div class="tool">
        <el-button type="primary" @click="newSchedule">
          <d2-icon name='plus' style="margin-right:8px"/>添加任务
        </el-button>
        <el-table :data='schedule.list'>
          <el-table-column label='任务名' prop='jobName'></el-table-column>
            <el-table-column label='描述' prop='description'></el-table-column>
            <el-table-column label='Cron表达式' prop='cronExpression'></el-table-column>
            <el-table-column label='关联设备' prop=''></el-table-column>
            <el-table-column label='任务数据'>
              <template slot-scope="scope">
                {{ JSON.stringify(scope.row.scheduleData) }}
              </template>
            </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="添加任务" width="600px" class="schedule-edit-dialog"
      :visible.sync="scheduleDetail.visible">
      <schedule-edit :data='scheduleDetail.data' :submit='editScheduleSubmit'/>
    </el-dialog>
  </d2-container>
</template>

<script>
import Schedule from '../../components/schedule/schedule.vue'
import ScheduleEdit from '../../components/schedule/schedule_edit.vue'

export default {
  name: 'project-device',
  components: {
    Schedule,
    ScheduleEdit,
  },
  data(){
    return {
      projectId: 0,
      searchParam:{},
      device:{
        list:[],
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
      }
    }
  },
  created() {
  },
  mounted() {
    this.projectId = this.$route.params.projectId;
    this.deviceList()
  },
  methods: {
    goBack() {
      this.$router.push({name:'project'})
    },
    onSearch(){},
    // ------设备--------
    deviceList(){
      this.$api.DEVICE_QUERY_FOR_PAGE({ 
          projectId: this.projectId 
        })
        .then((res) => {
          this.device.list = res.records;
        })
        .catch((err) => {
          console.log(err)
        });
    },
    // -----调度任务------
    openSchedule(id){
      const that = this
      that.schedule.deviceId = id
      this.schedule.visible = false
      this.scheduleList()
    },
    scheduleList(){
      const that = this
      const params = {
        linkId: that.schedule.deviceId,
        current: that.schedule.current,
        size: that.schedule.size,
      }
      that.schedule.visible = true
      // that.schedule.loading = true
      // that.$api.SCHEDULE_INFO(params)
      //   .then(res=>{
      //     that.schedule.list = res.records
      //     that.schedule.total = res.total
      //     that.schedule.loading = false
      //   })
      //   .catch(err=>{
      //     console.log(err)
      //     that.$message.error('拉取数据失败')
      //     that.schedule.loading = false
      //   })
    },
    newSchedule() {
      this.scheduleDetail.data = {
        deviceId: this.schedule.deviceId,
        jobName: '',
        cronExpression: '',
        // 转为json
        scheduleData: '',
        description: '',
      }
      this.scheduleDetail.visible = true
    },
    // editSchedule() {

    // },
    editScheduleSubmit(data){
      const that = this
      if(data.id===undefined) {
        data.scheduleData = JSON.parse(data.scheduleData)
        console.log(data)
        that.$api.SCHEDULE_CREATE(data)
          .then(res=>{
            that.$message.success('创建成功');
            that.scheduleDetail.visible = false
          })
          .catch(err=>{
            console.log(err)
            this.$message.error('添加任务出错');
          })
      }

    }
  },
};
</script>

<style lang='scss'>
.project-device-container{
  .device-table{
        .tool {
          .item{
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