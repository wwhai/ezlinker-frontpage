<template>
<div class="param-box">
    <div class="item" v-for="(p, i) in value" :key="'param'+i">
    <span class="elem field">
        <el-input placeholder="字段名" v-model="p.field"/>
    </span>
    <span class="elem type">
        <el-select v-model="p.type">
        <el-option label="Number" :value="1"></el-option>
        <el-option label="String" :value="2"></el-option>
        <el-option label="Boolean" :value="3"></el-option>
        <el-option label="JSON" :value="4"></el-option>
        </el-select>
    </span>
    <span class="elem default">
        <el-input placeholder="默认值" v-model="p.defaultValue"/>
    </span>
    <span class="elem desc">
        <el-input placeholder="备注" v-model="p.description"/>
    </span>
    <span class="elem close" @click="removeParam(i)"><d2-icon name='close'/></span>
    </div>
    <div class="item add-btn" @click="addParam"><d2-icon name="plus"/>新增</div>
</div>
</template>

<script>
export default {
  name: 'parameter',
  props: {
    value: Array
  },
  mounted () {
    console.log(this.data)
  },
  methods: {
    addParam () {
      this.value.push({
        field: '', type: 1, defaultValue: '', description: ''
      })
    },
    removeParam (index) {
      this.value.splice(index, 1)
    }
  }
}
</script>

<style lang='scss'>
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
</style>
