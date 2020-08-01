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
    <el-dialog title="项目详情" class="project-edit-container" 
      :close="editClose" :visible.sync="detail.visible">
        <el-form :model="detail.data" status-icon :rules="project.detailrules" label-width="50px"
          ref="projectEditForm" class="project-edit-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="detail.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <!-- <el-input v-model="detail.data.type" autocomplete="off"></el-input> -->
              <el-select v-model="detail.data.type" no-match-text='请选择' placeholder="请选择">
                <el-option label="自由项目" :value="1"></el-option>
                <el-option label="批量项目" :value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="detail.data.description"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="logo" class="label icon">
              <div class="icon-add-btn">
                  <!-- <img v-if="detail.data.logo&&detail.data.logo.length>0" :src="detail.data.logo"> -->
                  <div class="icon-box" @click="icon.visible=true">
                    <img class="img" v-if="detail.data.logo&&detail.data.logo.length>0" 
                    :src="detail.data.logo"/>
                    <d2-icon v-else name='plus'/>
                  </div>
              </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSubmit">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="选择图标" class="icon-dialog"
      :visible.sync="icon.visible" >
      <div class="list" >
        <img class="item" v-for="(item,index) in icon.list" :key="'icon'+index" 
        @click="chooseIcon(item)" :src="item"/>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import api from '@/api'
// import ProjectEdit from './components/edit'
export default {
  name: 'resource-project',
  // components: {
  //   ProjectEdit
  // },
  data () {
    return {
      project: {
        list: [],
        current: 1,
        size: 10,
        total: 0,
      },
      detail: {
        data: {},
        visible: false,
        rules: {
        name:[{
            required: true, message: '内容不可为空', trigger: 'blur' 
        }],
        description:[{
            required: true, message: '内容不可为空', trigger: 'blur' 
        }]
        }
      },
      icon:{
        list:[],
        visible: false
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
      api.PROJECT_LIST(params).then(res => {
        that.project.list = res.records
        that.project.total = res.total
      })
    },
    newProject () {
        this.detail.data = {name:'', type:'',description:'',logo:''}
        this. detail.visible = true
    },
    editProject (item) {
      if (item.type!=1&&item.type!=2){
        item.type = ''
      }
      this.detail.data = {...item}
      this.detail.visible = true
    },
    getIcon(){
      api.PROJECT_ICON().then(res=>{
        this.icon.list = res
      })
    },
    chooseIcon(img){
      this.detail.data.logo = img
    },
    editSubmit(){
      const that = this

      const id = that.detail.data.id
      const data = {
        name: that.detail.data.name, 
        type: that.detail.data.type,
        description: that.detail.data.description,
        logo: that.detail.data.logo
      }
      if (id!=undefined){
        api.PROJECT_UPDATE(id, data).then(res=>{
          that.projectList()
          that.editClose()
        })
        return
      }
      api.PROJECT_CREATE(data).then(res=>{
          that.projectList()
          that.editClose()
      })
    },
    editClose(){
        this.detail.data = {}
        this. detail.visible = false
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
.project-edit-container{
    .project-edit-form{ 
      .icon{
        .icon-add-btn{
          border: 1px solid #ccc;
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
          &:hover{
            border-color: #777;
          }
          .icon-box{
       
              .img{
                  width: 100%;
              }
          }
        }
      }
    }

}
.icon-dialog{
  .list{
    .item{
      width: 48px;
      height: 48px;
      margin: 5px 10px;
    }
  }
}
</style>
