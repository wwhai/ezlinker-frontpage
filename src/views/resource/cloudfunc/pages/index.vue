<template>
  <d2-container class="cloudfunc-container">
    <el-card class="box-card" style="min-height:99%">
      <!-- 页头 -->
      <el-page-header slot="header"  @back="goBack" :content='this.pageTitle'/>
      <!-- 检索表单 -->
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <!-- <el-form-item label="名称">
          <el-input v-model="searchParam.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="searchParam.type" placeholder="类型"></el-input>
        </el-form-item> -->
        <el-form-item label="描述">
          <el-input v-model="searchParam.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="newCloudfunc">新建</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <el-table border  :data='cloudfunc.list'>
        <!-- <el-table-column prop="id" label='ID'></el-table-column> -->
        <el-table-column prop="cloudAppId" label='App ID'></el-table-column>
        <el-table-column prop="label" label='标签'></el-table-column>
        <el-table-column label='启用'>
          <template slot-scope="scope">
            <el-switch
            v-model="scope.row.enable"
            active-text="是"
            inactive-text='否'>
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="description" label='描述'></el-table-column>
        <el-table-column prop="createTime" label='创建时间'></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button>详情</el-button>
            <el-button @click="openScript(scope.row.script)">脚本</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" 
        v-if='cloudfunc.total>cloudfunc.size' 
        :page-sizes='cloudfunc.size' :total="cloudfunc.total">
      </el-pagination>
      <!-- 查看脚本弹窗 -->
      <el-dialog title="云函数脚本" :visible.sync="script.visible">
        <!-- <el-input type='textarea' :value='script.data'></el-input> -->
        <code-editor :value="script.data" lang='js' :readonly='true' />
      </el-dialog>
      <el-dialog title="编辑云函数" :visible.sync="cloudfuncDetail.visible">
        <el-form :model='cloudfuncDetail.data' label-width="80px">
          <el-form-item label="启用">
            <el-switch v-model="cloudfuncDetail.data.enable" active-text="是" inactive-text='否'>
          </el-switch>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="cloudfuncDetail.data.description" placeholder="描述"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <code-editor v-model="cloudfuncDetail.data.script" lang='js' />
          </el-form-item>
          <el-form-item>
            <el-button>取消</el-button><el-button type='primary' @click="editCloudfuncSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </d2-container>
</template>

<script>
import CodeEditor from  '@/components/code-editor'
export default {
  name: 'cloudfunc',
  components:{
    CodeEditor,
  },
  data(){
    return {
      pageTitle: '云端函数',
      searchParam:{},
      cloudfunc:{
        list:[],
        current: 1,
        size: 10,
        total: 0,
        loading: false,
      },
      // cloudfunc.script
      script:{
        data: '',
        visible: false,
      },
      cloudfuncDetail: {
        data: {},
        visible: false,

      },
    }
  },
  mounted(){
    this.cloudfuncList()
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    cloudfuncList(){
      const that = this
      const params = {
        current: that.cloudfunc.current,
        size: that.cloudfunc.size,
      }
      that.cloudfunc.loading = true
      that.$api.CLOUDFUNC_LIST(params)
        .then(res=>{
          that.cloudfunc.list = res.records
          that.cloudfunc.total = res.total
          that.cloudfunc.loading = false
        })
        .catch(err=>{
          console.log(err)
          that.cloudfunc.loading = false
        })
    },
    onSearch(){
      
    },

    // 查看脚本
    openScript(data){
      this.script.data = data
      this.script.visible = true
    },
    newCloudfunc(){
      this.cloudfuncDetail.data = {
        enable: false,
        description: '',
        script: '',
      }
      this.cloudfuncDetail.visible = true
    },
    editCloudfuncSubmit(){
      const that = this
      const data = this.cloudfuncDetail.data
      console.log(data)
      // this.$api.CLOUDFUNC_CREATE()
      //   .then(res=>{
      //     that.$message.success('添加成功')
      //   })
      //   .catch(err=>{
      //     console.log(err)

      //   })
    }
  },
}
</script>

<style>

</style>
