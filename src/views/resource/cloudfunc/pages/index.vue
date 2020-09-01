<template>
  <d2-container class="cloudfunc-container">
    <el-card class="box-card" style="height:99%">
      <el-table :data='cloudfunc.list'>
      </el-table>

    </el-card>
  </d2-container>
</template>

<script>
export default {
  name: 'cloudfunc',
  data(){
    return {
      pageTitle: '云端函数',
      cloudfunc:{
        list:[],
        current: 1,
        size: 10,
        total: 0,
      }
    }
  },
  mounted(){

  },
  methods:{
    // gob
  },
}
</script>

<style>

</style>
