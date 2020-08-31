<template>
  <el-form  ref="dataForm" label-width="100px" status-icon
        :rules="rules" :model="data">
        <el-form-item label='任务名称'>
            <el-input v-model="data.jobName"></el-input>
        </el-form-item>
        <el-form-item label='任务描述'>
            <el-input v-model="data.description"></el-input>
        </el-form-item>
        <el-form-item label='Cron表达式'>
            <el-input v-model="data.cronExpression"></el-input>
        </el-form-item>
        <el-form-item label='任务数据'>
             <el-input type="textarea" :autosize='{ minRows: 3, maxRows: 8 }' 
             v-model="data.scheduleData"></el-input>
        </el-form-item>
        <el-form-item >
            <el-button type="warning" @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-form-item>
  </el-form>
</template>

<script>
export default {
    name: 'schedule-edit',
    props:{
        data: Object,
        submit: Function,
        cancel: Function,
    },
    data(){
        return {
            rules: {}
        }
    },
    methods:{
        handleSubmit(){
           if(this.submit){
               const data = {...this.data}
                this.submit(data)
            }
        },
        handleCancel(){
            if(this.cancel){
                this.cancel()
            }
        }
    },
}
</script>

<style>

</style>