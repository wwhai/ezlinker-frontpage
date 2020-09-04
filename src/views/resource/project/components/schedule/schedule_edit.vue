<template>
    <div class='schedule-edit'>
        <el-form  ref="dataForm" label-width="100px" status-icon
                :rules="rules" :model="data">
                <el-form-item label='任务名称'>
                    <el-input v-model="data.jobName"></el-input>
                </el-form-item>
                <el-form-item label='任务描述'>
                    <el-input v-model="data.description"></el-input>
                </el-form-item>
                <el-form-item label='Cron表达式'>
                    <el-input @focus="cron.visible=true" v-model="data.cronExpression"></el-input>
                </el-form-item>
                <el-form-item label='任务数据'>
                    <el-input type="textarea" :autosize='{ minRows: 3, maxRows: 8 }' 
                    @focus='openScheduleData' v-model="data.scheduleData"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="warning" @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit">确 定</el-button>
                </el-form-item>
        </el-form>
        <el-dialog title="编辑Cron表达式" :visible.sync="cron.visible" :modal='false' top="3vh" width='600px'>
            <cron v-model='data.cronExpression'></cron>
        </el-dialog>
        <el-dialog title="编辑任务数据" :visible.sync="scheduleData.visible" :modal='false' top="3vh" width='600px'>
            <json-editor v-model="scheduleData.data" ></json-editor>
            <div class="tool" style="padding:16px 0px;">
                <el-button type='primary' @click="closeScheduleData">确定</el-button>
                <el-button type='' @click="scheduleData.visible=false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Cron from '@/components/cron'
import JsonEditor from '@/components/json-editor'

export default {
    name: 'schedule-edit',
    components: {
        Cron,
        JsonEditor,
    },
    props:{
        data: Object,
        submit: Function,
        cancel: Function,
    },
    data(){
        return {
            cron:{
                visible: false,
            },
            scheduleData:{
                data: {},
                visible: false,
            },
            rules: {}
        }
    },
    mounted(){
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
        },
        openScheduleData(){
            this.scheduleData.data = JSON.parse(this.data.scheduleData)
            this.scheduleData.visible = true
        },
        closeScheduleData(){
            this.data.scheduleData =  JSON.stringify(this.scheduleData.data)
            this.scheduleData.data = {} 
            
            this.scheduleData.visible = false
        },
    },
}
</script>

<style>

</style>