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
