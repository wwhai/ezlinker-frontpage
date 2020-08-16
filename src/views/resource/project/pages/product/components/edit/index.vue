<template>
    <el-form :model="detail.data" status-icon :rules="detail.rules" label-width="50px"
          ref="productEditForm" class="product-edit-form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="detail.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="detail.data.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tag">
            <el-select v-model="detail.data.tags"
              multiple filterable allow-create default-first-option
              placeholder="请添加产品标签">
            </el-select>
          </el-form-item>
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="detail.data.protocol" no-match-text='请选择' placeholder="请选择">
              <el-option label="TCP" :value="0"></el-option>
              <el-option label="MQTT" :value="1"></el-option>
              <el-option label="HTTP" :value="2"></el-option>
              <el-option label="COAP" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="detail.data.type" placeholder="请选择">
              <el-option label="通用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- 产品属性 -->
          <el-form-item label="属性" class="param">

          </el-form-item>
          <el-form-item label="图标">
            <div class="icon-add-btn">
                  <img v-if="detail.data.logo&&detail.data.logo.length>0" :src="detail.data.logo">
                  <!-- <div class="icon-box" @click="icon.visible=true">
                    <img class="img" v-if="detail.data.logo&&detail.data.logo.length>0"
                    :src="detail.data.logo"/>
                    <d2-icon v-else name='plus'/>
                  </div> -->
              </div> 
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSubmit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
</template>

<script>
export default {
    name: 'product-edit',
    props:{
        data: Object,
        handle: Function
    },
    data(){
        return  {
            detail: {
                data: {},
                rules: {}
            },
        }
    },
    methods: {
        editSubmit(){
            const that = this
            that.handle(that.data)
        }
    }
}
</script>

<style>

</style>