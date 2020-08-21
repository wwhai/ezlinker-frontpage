<template>
        <el-form :model="data" status-icon :rules="rules" label-width="50px"
          ref="projectEditForm" class="project-edit-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
              <el-select v-model="data.type" no-match-text='请选择' placeholder="请选择">
                <el-option label="自由项目" :value="1"></el-option>
                <el-option label="批量项目" :value="2"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="data.description"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="logo" class="label icon">
            <choose-icon class="choose-icon" :init='data.logo' :handle='chooseIcon'></choose-icon>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
</template>

<script>
import ChooseIcon from '@/components/choose-icon'

export default {
  name: 'project-edit',
  components: {
    ChooseIcon
  },
  data () {
    return {
      // project: this.data,
      rules: {
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
  props: {
    data: Object,
    handle: Function
  },
  methods: {
    chooseIcon (item) {
      this.data.logo = item
    },
    submit () {
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
.project-edit-form{
  .choose-icon{
    .icon-box{
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
