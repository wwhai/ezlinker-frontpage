<template>
  <el-form :model="data" label-width="40px" class="edit-form">
    <el-form-item label="名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="data.description"></el-input>
    </el-form-item>
    <el-form-item label="属性" class="param">
      <parameter v-model="data.dataAreas"/>
    </el-form-item>
    <el-form-item >
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Parameter from '@/components/param'

export default {
  name: 'module-edit',
  components: {
    Parameter
  },
  props: {
    data: Object,
    hanlde: Function
  },
  methods: {
    submit () {
      if (this.hanlde) {
        this.hanlde(this.data)
      }
    }
  }
}
</script>

<style lang='scss'>
  .edit-form{

    padding: 0 20px;
         .param{
       .param-box{
         .item{
           line-height: 32px;
           font-size: 14px;
           height: 32px;
           .elem {
             display: inline-block;
             width: 20%;
             z-index: 9;
             .el-input__inner{
               height: 32px;
               border-radius: 0px;
             }
             &:hover{
                z-index: 9999;
                border-color: #555;
             }
           }
           .elem + .elem{
             margin-left: -1px;
           }
           .field{
             width: 25%;
           }
           .desc{
             width: 29%;
           }
           .close{
             width: 6%;
             border: 1px solid #ddd;
             font-size: 14px;
              text-align: center;
              line-height: 30px;
              &:hover{
                cursor: pointer;
              }
           }
         }
         .item + .item{
           margin-top: 14px;
         }
         .add-btn{
           border: 1px dashed #ddd;
           text-align: center;
           color: #999;
           cursor: pointer;
           &:hover{
             border-color: #999;
             color: #555;
           }
           .fa{
             margin-right: 6px;
           }
         }
       }
     }
    }

</style>
