<template>
 <d2-container>
    <div class="project-container">
        <div class="project-card add-card" @click="newProject">
            <span>
                <d2-icon name="plus"/>
                新增项目
            </span>
        </div>
        <div class="project-card" v-for="(item,index) in project.list" :key="'project'+index">
            <div class="top">
                <div class="avatar">
                <img :src="item.logo" class="image">
                </div>
                <div class="info">
                    <div class="setting" @click="editProject(item)">
                        <d2-icon name="gear"/>
                    </div>
                    <div class="name">{{item.name}}</div>
                    <div class="desc">{{item.description}}</div>
                </div>
            </div>
            <div class="bot">
              <router-link class="device" 
              :to="{path:'/project/'+item.id+'/device'}">
                设备管理
              </router-link>
              <router-link class="product" 
              :to="{path:'/project/'+item.id+'/product'}">
              产品设计
              </router-link>
            </div>
        </div>
    </div>
    <!-- 修改项目详情 -->
    <!-- FIXME  弹出框存在bug，内容只显示第一次打开的卡片-->
    <el-dialog title="项目详情" :close="editClose" :visible.sync="project.detail.visible">
        <ProjectEdit :data="project.detail.data" :handle="editSubmit"/>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api'
import ProjectEdit from './components/edit'
export default {
  name: 'resource-project',
  components: {
    ProjectEdit
  },
  data () {
    return {
      project: {
        list: [],
        current: 1,
        size: 10,
        total: 0,
        detail: {
          data: {},
          visible: false
        }
      }
    }
  },
  mounted () {
    this.projectList()
  },
  methods: {
    projectList () {
      var params = {
        current: this.project.current,
        size: this.project.size
      }
      const that = this
      api.PROJECT_LIST(params).then(res => {
        that.project.list = res.records
        that.project.total = res.total
      })
    },
    newProject () {
      console.log('add new project')
    },
    editProject (item) {
      this.project.detail.data = item
      this.project.detail.visible = true
    },
    editSubmit(data){
        console.log(data)
        this.editClose()
    },
    editClose(){
        this.project.detail.data = {}
        this.project.detail.visible = false
    },
    projectDevice (id) {
      console.log('projectDevice', id)
    },
    projectDesign (id) {
      console.log('projectDesign', id)
    }
  }
}
</script>

<style lang='scss'>
.project-container{
    display: flex;
    flex-wrap: wrap;
    .project-card{
        width: 28%;
        // margin-right: 40px;
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
                    height: 64px;
                    margin-bottom: 1em;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
</style>
