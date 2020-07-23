<template>
 <d2-container>
  <el-tabs >
    <el-tab-pane label="基本信息">
        <el-form  ref="infoForm" :model="user" status-icon :rules="rules" 
            label-width="80px" class="accountForm">
            <el-form-item prop="nickName" label="用户昵称" >
                <el-input type="text"
                v-model="user.nickName"
                placeholder="用户昵称">
                </el-input>
            </el-form-item>
            <el-form-item prop="realName" label="真实姓名" >
                <el-input v-model="user.realName"
                placeholder="真实姓名">
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" label="手机号码" >
                <el-input type="text"
                v-model="user.phone"
                placeholder="手机号码">
                </el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱地址" >
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
        <!-- <div class="info-box">
            <div class=""
                {{user.username}}
            
            <el-form-item label="上次登录" >
                {{user.lastLoginTime}} {{user.lastLoginIp}}
            </el-form-item>
        </el-form> -->
    </el-tab-pane>
    <el-tab-pane label="修改密码">修改密码</el-tab-pane>
  </el-tabs>
 </d2-container>
</template>

<script>
import api from '@/api'

export default {
    name: 'account',
    data(){
        return {
            user:{},
            // 表单校验
            rules: {
                phone: [{required: true,message: '请输入电话',trigger: 'blur'}],
                email: [{required: true,message: '请输入邮箱',trigger: 'blur'}],
                realName: [{required: true,message: '请输入真实姓名',trigger: 'blur'}],
                nickName: [{required: true,message: '请输入昵称',trigger: 'blur'}]
            }
        }
    },
    mounted(){
        this.getUserInfo()
    },
    methods:{
        getUserInfo(){
            const that = this
            api.USER_INFO().then(res=>{
                that.user = res
                console.log('user', that.user)
            })
        },
        submit () {
            const that = this
            this.$refs.infoForm.validate((valid) => {
                if (valid) {
                    const data = {
                        phone: that.user.phone, 
                        email: that.user.email, 
                        realName: that.user.realName, 
                        nickName: that.user.nickName, 
                    }
                    that.$api.UPDATE_USER_INFO(data).then(res => {
                        that.$message(res)
                        // that.$router.push({ name: 'index' })
                    })
                }
            })
        }
    }

}
</script>

<style>

</style>