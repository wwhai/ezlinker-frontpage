<template>
    <d2-container>
        <el-form ref="infoForm" label-position="top" class="user-edit-form"
            :rules="rules" :model="user" label-width="80px" size="medium">
            <el-form-item prop="nickName" label="用户昵称" >
                <el-input type="text"
                v-model="user.nickName"
                placeholder="用户昵称">
                </el-input>
            </el-form-item>
            <el-form-item prop="realName" label="真实姓名"  label-width="40%">
                <el-input type="password"
                v-model="user.realName"
                placeholder="真实姓名">
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机号码" label-width="40%">
                <el-input type="text"
                v-model="user.phone"
                placeholder="手机号码">
                </el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱地址" label-width="40%">
                <el-input type="text"
                v-model="user.email"
                placeholder="邮箱地址">
                </el-input>
            </el-form-item>
            <el-button size="default"
                @click="submit"
                type="primary"
                class="button-login">
                完成
            </el-button>
            </el-form>
    </d2-container>
</template>

<script>
import api from '@/api'
export default {
  name: 'self-edit',
  data () {
    return {
      user: {
        phone: '',
        email: '',
        realName: '',
        nickName: ''
      },
      // 表单校验
      rules: {
        phone: [{
          required: true,
          message: '请输入电话',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        realName: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }],
        nickName: [{
          required: true,
          message: '请输入昵称',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      api.USER_INFO().then(data => {
        this.user = {
          phone: data.phone,
          email: data.email,
          realName: data.realName,
          nickName: data.nickName
        }
      })
    },
    submit () {
      const that = this
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          that.$api.UPDATE_USER_INFO(that.user).then(res => {
            that.$message(res)
            that.$router.push({ name: 'index' })
          })
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.user-edit-form{
  width: 80%;
  .el-form-item {
    width: 45%;
  }
}
</style>
