<template>
 <d2-container class="account-container">
  <el-tabs class="tab-list">
    <el-tab-pane label="账户信息" class="tab">
        <!-- <div class="form userForm">
            <div class="item">
                <div class="title">用户名:</div>
                <div class="content">{{user.username}}</div>
            </div>
            <div class="item">
                <div class="title">QQ账号:</div>
                <div class="content">{{user.qq}}</div>
            </div>
            <div class="item">
                <div class="title">微信账号:</div>
                <div class="content">{{user.wechat}}</div>
            </div>
            <div class="item">
                <div class="title">真实姓名:</div>
                <div class="content">{{user.realName}}</div>
            </div>
            <div class="item">
                <div class="title">用户昵称:</div>
                <div class="content">{{user.nickName}}</div>
            </div>
            <div class="item">
                <div class="title">详细地址:</div>
                <div class="content">{{user.address}}</div>
            </div>
            <div class="item">
                <div class="title">所在区县:</div>
                <div class="content">{{user.area}}</div>
            </div>
            <div class="item">
                <div class="title">所在省份:</div>
                <div class="content">{{user.province}}</div>
            </div>
            <div class="item">
                <div class="title">邮箱:</div>
                <div class="content">{{user.email}}</div>
            </div>
            <div class="item">
                <div class="title">登录地址:</div>
                <div class="content">{{user.lastLoginIp}}</div>
            </div>
            <div class="item">
                <div class="title">登录时间:</div>
                <div class="content">{{user.lastLoginTime}}</div>
            </div>
        </div> -->
    </el-tab-pane>
    <el-tab-pane label="更改账户" class="tab">
        <el-form  ref="infoForm" :model="detail.data" status-icon :rules="detail.rules"
            label-width="80px" class="form accountForm">
            <el-form-item prop="nickName" label="用户昵称" >
                <el-input type="text"
                v-model="detail.data.nickName"
                placeholder="用户昵称">
                </el-input>
            </el-form-item>
            <el-form-item prop="realName" label="真实姓名" >
                <el-input v-model="detail.data.realName"
                placeholder="真实姓名">
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机号码" >
                <el-input type="text"
                v-model="detail.data.phone"
                placeholder="手机号码">
                </el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱地址" >
                <el-input type="text"
                v-model="detail.data.email"
                placeholder="邮箱地址">
                </el-input>
            </el-form-item>
            <el-form-item>
                <!-- <el-button size="default"
                    @click="reset" class="btn-reset">
                    重置
                </el-button> -->
                <el-button size="default" @click="submit"
                    type="primary" class="btn-sumbit">
                    完成
                </el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="修改密码" class="tab">
        <el-form  ref="pwdForm" :model="pwd.data" status-icon :rules="pwd.rules"
            label-width="80px" class="form accountForm">
            <el-form-item prop="oldPassword" label="旧密码" >
                <el-input type="password"
                v-model="pwd.data.oldPassword"
                placeholder="输入之前的密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码" >
                <el-input v-model="pwd.data.newPassword" type="password"
                placeholder="输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="passwordRetry" label="重复密码" >
                <el-input type="password"
                v-model="pwd.data.passwordRetry"
                placeholder="再次输入新密码进行验证">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="default"
                    @click="reset('pwdForm')" class="btn-reset">
                    重置
                </el-button>
                <el-button size="default" @click="submitPwd"
                    type="primary" class="btn-sumbit">
                    完成
                </el-button>
            </el-form-item>
        </el-form>
    </el-tab-pane>
  </el-tabs>
 </d2-container>
</template>

<script>
import api from '@/api'

export default {
  name: 'account',
  data () {
    return {
      user: {},
      detail: {
        // 表单校验
        data: {},
        rules: {
          phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
          email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
          realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
          nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
        }
      },
      pwd: {
        data: {
          oldPassword: '',
          newPassword: '',
          passwordRetry: ''
        },
        rules: {
          oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          newPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          passwordRetry: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        }
      }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      const that = this
      api.USER_INFO().then(res => {
        that.user = res
        that.detail.data = {
          phone: res.phone,
          email: res.email,
          realName: res.realName,
          nickName: res.nickName
        }
        console.log(res)
      })
    },
    submit () {
      const that = this
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          const data = { ...that.detail.data }
          that.$api.UPDATE_USER_INFO(data).then(res => {
            that.$message(res)
          })
        }
      })
    },
    submitPwd () {
      const that = this
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          const data = {
            ...that.pwd.data
          }
          this.$api.UPDATE_PWD(data).then(res => {
            that.$message(res)
            that.reset('pwdForm')
          })
        }
      })
    },
    reset (formName) {
      // 重置字段值
      this.$refs[formName].resetFields()
      // this.getUserInfo()
    }
  }

}
</script>

<style lang='scss'>
.account-container{
    .tab-list{
        .tab{
            .form{
                width: 50%;
            }
            .userForm{
                display: flex;
                flex-wrap: wrap;
                min-width: 500px;
                .item{
                    display: flex;
                    margin-right: 30px;
                    margin-top: 10px;
                    .title{
                        width: 70px;
                        text-align: right;
                        padding-right: 8px;
                    }
                    .content{
                        width: 140px;
                        text-align: left;
                    }
                }
            }
        }
    }
}
</style>
