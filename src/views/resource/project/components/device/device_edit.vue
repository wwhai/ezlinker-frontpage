<template>
    <el-form ref="deviceForm" label-width="80px" status-icon
        :rules="rules" :model="data"
    >
        <el-form-item label="设备名称" prop="name">
          <el-input type="text" v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="设备厂家" prop="industry">
          <el-input type="text" v-model="data.industry"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input type="text" v-model="data.model"></el-input>
        </el-form-item>
        <el-form-item label="设备描述" prop="description">
          <el-input type="text" v-model="data.description"></el-input>
        </el-form-item>

        <el-form-item label="生产类型" prop="createType">
          <el-select v-model="createType.curr" placeholder="请选择" >
            <el-option
              v-for="item in createType.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生产数量" prop="createCount">
          <el-input-number
            v-model="data.createCount"
            :min="1"
            :max="100"
            :disabled="createType.curr!==1"
          ></el-input-number>
        </el-form-item>
        <el-form-item >
            <el-button type="warning" @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'device-edit',
    props:{
        data: Object,
        submit: Function,
        cancel: Function,
    },
    data(){
        return {
            //1 量产；2 单个
            createType: {
                curr: 2,
                list:[
                    { label: "批量生产", value: 1 },
                    { label: "单个设备", value: 2 },
                ]
            },
            rules: {
                name: [{
                    required: true,
                    message: "内容不可为空",
                    trigger: "blur",
                },
                ],
                // productId: [
                // {
                //     required: true,
                //     message: "内容不可为空",
                //     trigger: "blur",
                // },
                // ],
            },
        }
    },
    methods:{
        handleCancel(){
            if (this.cancel){
                this.cancel()
            }
        },
        handleSubmit(){
            this.$refs.deviceForm.validate((valid) => {
                if (valid) {
                    const item = {
                        ...this.data,
                        createCount: this.createType.curr===1?this.data.createCount:1,
                    }
                    if (this.submit){
                        this.submit(item)
                    }
                }
            })
        },
    },
}
</script>

<style>

</style>