<template>
  <!-- 产品编辑 -->
  <el-form :model="data" status-icon :rules="rules" label-width="50px"
          ref="productEditForm" class="product-edit-form">
    <el-form-item label="名称" prop="name">
      <el-input v-model="data.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="data.description" autocomplete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item label="标签" prop="tag">
      <el-select v-model="data.tags" multiple filterable allow-create
      default-first-option placeholder="请添加产品标签">
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="协议" prop="protocol">
      <el-select v-model="data.protocol" no-match-text='请选择' placeholder="请选择">
        <el-option label="TCP" :value="0"></el-option>
        <el-option label="MQTT" :value="1"></el-option>
        <el-option label="HTTP" :value="2"></el-option>
        <el-option label="COAP" :value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="data.type" placeholder="请选择">
        <el-option label="通用" value="1"></el-option>
      </el-select>
    </el-form-item> -->
    <!-- 产品属性 -->
    <el-form-item label="属性" class="param">
      <parameter v-model='data.parameters' ></parameter>
    </el-form-item>
    <!-- 产品图标 -->
    <el-form-item label="图标" class="item icon">
      <choose-icon class="choose-icon" :init='data.logo' :handle='chooseIcon'></choose-icon>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="editSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseIcon from '@/components/choose-icon'
import Parameter from '@/components/param'

export default {
  name: 'product-edit',
  props: {
    data: Object,
    handle: Function
  },
  components: {
    ChooseIcon,
    Parameter
  },
  data () {
    return {
      rules: {}
    }
  },
  methods: {
    editSubmit () {
      const that = this
      that.handle(that.data)
    },
    chooseIcon (item) {
      this.data.logo = item
    }
  }
}
</script>

<style lang='scss'>
.product-edit-form{
  .item{

  }
  .icon{
    .choose-icon{
      .icon-box{
        width: 80px;
        height: 80px;
        line-height: 80px;
      }
    }
  }
}
</style>
