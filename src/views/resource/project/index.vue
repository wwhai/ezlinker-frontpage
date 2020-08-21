<template>
 <d2-container class="project-container" v-loading="project.loading">
    <!-- 项目列表 -->
    <div class="project-list">
        <!-- 新建项目卡片  -->
        <div class="project-card add-card" @click="newProject">
          <span><d2-icon name="plus"/>新增项目</span>
        </div>
        <!-- 项目详情卡片 -->
        <div class="project-card" v-for="(item,index) in project.list" :key="'project'+index">
          <!-- 项目基本信息 -->
          <div class="top">
            <!-- 项目图标 -->
            <div class="avatar"><img :src="item.logo" class="image" alt="项目图标"></div>
            <!-- 项目信息 -->
            <div class="info">
              <!-- 项目编辑 -->
              <div class="setting" @click="editProject(item)">
                  <d2-icon name="gear"/>
              </div>
              <div class="name">{{item.name}}</div>
              <div class="desc">{{item.description}}</div>
            </div>
          </div>
          <!-- 按钮组 -->
          <div class="bot">
            <router-link :to="{path:'/project/'+item.id+'/device'}"
            class="device" >设备管理</router-link>
            <router-link :to="{path:'/project/'+item.id+'/product'}"
              class="product">产品设计</router-link>
          </div>
        </div>
    </div>
    <!-- 项目分页 -->
    <el-pagination v-if="project.total>12" class="project-page"
      background layout="prev, pager, next" :total="project.total"></el-pagination>
    <!-- 修改项目详情 -->
    <el-dialog title="项目详情" class="project-edit"
      :close="editClose" :visible.sync="detail.visible">
      <project-edit :data='detail.data' :handle='editSubmit'></project-edit>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api'
import ProjectEdit from './edit.vue'
import { Loading } from 'element-ui';

export default {
  name: 'resource-project',
  components: {
    ProjectEdit
  },
  data () {
    return {
      // 项目列表
      project: {
        list: [],
        current: 1,
        size: 12,
        total: 0,
        loading: false,
      },
      // 项目编辑的数据
      detail: {
        data: {},
        visible: false,
        loading: false,
        rules: {
          name: [{
            required: true, message: '内容不可为空', trigger: 'blur'
          }],
          description: [{
            required: true, message: '内容不可为空', trigger: 'blur'
          }]
        }
      }
    }
  },
  mounted () {
    this.projectList()
    this.getIcon()
  },
  methods: {
    projectList () {
      var params = {
        current: this.project.current,
        size: this.project.size
      }
      const that = this
      that.project.loading = true
      api.PROJECT_LIST(params).then(res => {
        that.project.list = res.records
        that.project.total = res.total
        that.project.loading = false
      }).catch(err=>{
        console.log(err)
        that.project.loading = false
      })
    },
    newProject () {
      this.detail.data = { name: '', type: '', description: '', logo: '' }
      this.detail.visible = true
    },
    editProject (item) {
      if (item.type != 1 && item.type != 2) {
        item.type = ''
      }
      this.detail.data = { ...item }
      this.detail.visible = true
    },
    // 提交项目更改
    editSubmit (item) {
      const that = this
      const id = item.id
      const data = {
        name: item.name,
        type: item.type,
        description: item.description,
        logo: item.logo
      }
      // const loading = Loading.service({ fullscreen: true })
      // id正确时，更新该项目
      if (id != undefined) {
        api.PROJECT_UPDATE(id, data).then(res => {
          that.projectList()
          that.editClose()
          // loading.close()
        }).catch(err=>{
          // loading.close()
        })
        return
      }
      // id不正确，说明是新建项目
      api.PROJECT_CREATE(data).then(res => {
        that.projectList()
        that.editClose()
          // loading.close()
      }).catch(err=>{
          // loading.close()
      })
    },
    editClose () {
      this.detail.data = {}
      this.detail.visible = false
    }
  }
}
</script>

<style lang='scss'>
.project-container{
  .project-list{
      display: flex;
      flex-wrap: wrap;
      .project-card{
          width: 28%;
          max-width: 274px;
          margin: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
          border-radius: 2px;
          &:hover{
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          }
          .top{
              padding: 24px;
              border-bottom: 1px solid #fff;
              &>div {
                  // display: inline-block;
              }
              .avatar{

                  float: left;
                  padding-right: 16px;
                  img{
                      // width: 100%;
                      width: 48px;
                      height: 48px;
                  }
              }
              .info {
                  position: relative;
                  padding-left: 64px;
                  .name{
                      margin-bottom: 12px;
                      overflow: hidden;
                      color: rgba(0, 0, 0, 0.85);
                      font-weight: 500;
                      font-size: 16px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                  }
                  .desc{
                      font-size: 14px;
                      font-variant: tabular-nums;
                      line-height: 1.5715;
                      list-style: none;
                      color: rgba(0, 0, 0, 0.45);
                      height: 62px;
                      // margin-bottom: 1em;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      overflow-wrap: break-word;
                  }
                  .setting{
                      position: absolute;
                      right: 0;
                      top:0;
                      cursor: pointer;
                  }
              }
          }
          .bot{
              background: #fafafa;
              border-top: 1px solid #f0f0f0;
              cursor: pointer;
              & > a{
                  // float:left;
                  margin: 12px 0;
                  color: rgba(0, 0, 0, 0.45);
                  text-align: center;
                  width: 49.5%;
                  display: inline-block;
                  &:hover{
                      color: #40475c;
                  }
              }
              .device{
                  border-right: 1px solid #f0f0f0;
              }
              .product{

              }
          }

      }
      .add-card{
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border: 1px dashed #eee;
          color: #999;
          line-height: 180px;
          font-size: 14px;
          &:hover{
              color: #40475c;
              border: 1px dashed #40475c;
          }
          span{
              display: inline-block;
              cursor: pointer;
              .fa{
                  margin-right: 6px;
              }
          }
      }
  }
  .project-page{
    margin-top: 20px;
  }
}
</style>
