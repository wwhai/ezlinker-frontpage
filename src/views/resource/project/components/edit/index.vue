<template>
<el-form :model="project" status-icon :rules="rules" label-width="50px"
  ref="projectEditForm" class="project-edit-container">
  <el-form-item label="名称" prop="name">
    <el-input v-model="project.name" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="类型" prop="type">
    <el-input v-model="project.type" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="描述" prop="description">
    <el-input type="textarea" v-model="data.description"></el-input>
  </el-form-item>
  <el-form-item label="图标" prop="logo" class="label icon">
      <div class="icon-box">
          <img v-if="project.logo&&project.logo.length>0" :src="data.logo">
      </div>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submit">提交</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import api from '@/api'
import { title } from 'faker/lib/locales/zh_CN'

export default {
  name: 'project-edit',
  data () {
    return {
      project: this.data,
      rules: {
          name:[{
              required: true, message: '内容不可为空', trigger: 'blur' 
          }],
          description:[{
              required: true, message: '内容不可为空', trigger: 'blur' 
          }]
      }
    }
  },
  props: {
    data: Object,
    handle: Function,
  },
  methods: {
      submit(){
        const that = this
        that.$refs.projectEditForm.validate((valid) => {
            if (valid) {
                that.handle(that.data)
            }
        })
      }
  }
}
</script>

<style lang='scss'>
.project-edit-container{
    .label{

    }
    .icon{
        .icon-box{
            width: 48px;
            height: 48px;
            img{
                height: 100%;
            }
        }
    }
}
</style>
