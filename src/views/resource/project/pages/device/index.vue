<template>
  <d2-container class="project-container">
    <el-card class="box-card">
      <!-- 页头 -->
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack">
          <template slot="content">{{this.pageTitle}}</template>
        </el-page-header>
      </div>

      <!-- 搜索条件 -->
      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="设备SN">
          <el-input v-model="searchParam.sn" placeholder="SN"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchParam.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="searchParam.model" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item label="厂家">
          <el-input v-model="searchParam.industry" placeholder="厂家"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- ------- -->
      <!-- 数据表格 -->
      <el-table stripe :data="deviceRecords.tableData" border style="width: 100%" height="700px">
        <el-table-column prop="sn" label="设备SN" width="200"></el-table-column>
        <el-table-column prop="name" label="设备名称" width="180"></el-table-column>
        <el-table-column prop="model" label="设备型号" width="180"></el-table-column>
        <el-table-column prop="industry" label="生产厂家" width="180"></el-table-column>
        <el-table-column prop="state" label="当前状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 1" type="success">在线</el-tag>
            <el-tag v-else type="warning">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="生产日期" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary">详情</el-button>
            <el-button size="mini" plain type="primary">指令测试</el-button>
            <el-button size="mini" plain type="primary">下载密钥</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top:8px; text-align:right">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="onCurrentPageChange"
          :page-size="deviceRecords.size"
          :total="deviceRecords.total"
        ></el-pagination>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
export default {
  mounted() {},

  created() {
    this.getDeviceData(this.searchParam);
  },
  data() {
    return {
      // 页面头部标题
      pageTitle: "设备管理",
      // 多个结果用XXXRecords
      deviceRecords: {
        current: 1,
        size: 10,
        total: 0,
        pages: 0,
        tableData: [],
      },
      //搜索条件
      searchParam: {
        productId: this.$route.params.projectId,
        current: 1,
        size: 10,
        name: "",
        sn: "",
        model: "",
        industry: "",
      },
    };
  },
  methods: {
    // 分页事件响应
    onCurrentPageChange(currentPage) {
      this.searchParam.current = currentPage;
      this.getDeviceData(this.searchParam);
    },
    // 加载数据函数，命名规范：getXXXData(参数)
    // ！！！ 注意：在lambda表达式，this统一叫thiz；
    getDeviceData(param) {
      let thiz = this;
      thiz.$api
        .DEVICE_QUERY_FOR_PAGE(param)
        .then((res) => {
          //
          thiz.deviceRecords.tableData = res.records;
          thiz.deviceRecords.current = res.current;
          thiz.deviceRecords.size = res.size;
          thiz.deviceRecords.total = res.total;
          thiz.deviceRecords.pages = res.pages;
          //
          thiz.searchParam.size = res.size;
        })
        .catch((err) => {
          console.log(error);
        });
    },
    // 条件检索
    search() {
      this.getDeviceData(this.searchParam);
    },
    // 历史回退
    goBack() {
      this.$router.push("/project");
    },
  },
};
</script>