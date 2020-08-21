<template>
 <d2-container class="account-container">
   <div class="wrapper">
    <div class="account">
      <div class="account-box form userForm">
      <div class="meta">
        <div class="avatar"><img :src="user.avatar" onerror="javascript:this.src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" alt="avatar"/></div>
        <div class="nickname">{{user.nickName}}</div>
      </div>
      <div class="info">
        <div class="item" v-if="user.realName&&user.realName.length>0">
          <span class="title"><d2-icon name='user-o'/></span>
          <span class="content">{{user.realName}}</span>
        </div>
        <div class="item" v-if="user.qq&&user.qq.length>0">
          <span class="title"><d2-icon name='qq'/></span>
          <span class="content">{{user.qq}}</span>
        </div>
        <div class="item" v-if="user.email&&user.email.length>0">
          <span class="title"><d2-icon name='envelope-o'/></span>
          <span class="content">{{user.email}}</span>
        </div>
        <div class="item" v-if="user.wechat&&user.wechat.length>0">
            <span class="title"><d2-icon name='wechat'/></span>
            <span class="content">{{user.wechat}}</span>
        </div>
        <div class="item" v-if="user.province&&user.province.length>0">
            <span class="title"><d2-icon name='address-book-o'/></span>
            <span class="content">{{user.province}}</span>
        </div>
        <div class="item" v-if="user.lastLoginIp&&user.lastLoginIp.length>0">
            <span class="title"><d2-icon name='send-o'/></span>
            <span class="content">{{user.lastLoginIp}}</span>
        </div>
        <div class="item" v-if="user.lastLoginTime&&user.lastLoginTime.length>0">
            <span class="title"><d2-icon name='plus-square-o'/></span>
            <span class="content">{{user.lastLoginTime}}</span>
        </div>
      </div>
      </div>
    </div>
    <el-tabs class="settings tab-list">
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
   </div>
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
  .wrapper{
    display: flex;
    // justify-content: space-between;
    .account{
      min-width: 280px;
      width: 25%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      padding: 16px;
      .account-box{
        .meta{
          text-align: center;
          .avatar{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #ddd;
            display: inline-block;
            img{
              width: 100%;
            }
          }
          .nickname{
            margin-top: 20px;
          }
        }
      }
      .info{
        margin-top: 26px;
        padding: 0 10px;
        .item{
          
            .title{
                // width: 70px;
                text-align: right;
                padding-left: 44px;
                padding-right: 4px;
            }
            .content{

                  // width: 140px;
              text-align: left;
              margin-left: 10px;
            }
        }
        .item + .item{
          margin-top: 20px;
        } 
      }
    }
    .tab-list{
      margin-left: 40px;
      width: 70%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      .el-tabs__header{
        .el-tabs__nav-wrap{
          padding: 0 20px;
          .el-tabs__item{
            font-size: 16px;
            padding-top: 16px;
            padding-bottom: 16px;
            height: 60px;
          }
        }
      }
      .el-tabs__content{
        padding: 20px;
        .tab{
          .form{
              width: 50%;
              .el-form-item{
                margin-bottom: 30px;
              }
          }
        }
      }
    }
  }
}
</style>
