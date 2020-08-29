<template>
  <d2-container class="project-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack" content="设备列表"></el-page-header>
      </div>

      <el-form :inline="true" :model="searchParam" class="demo-form-inline">
        <el-form-item label="查询设备">
          <el-input v-model="searchParam.user" placeholder="名称/型号/SN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table stripe="true" :data="deviceList" border style="width: 100%" height="700px">
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
      <div style="margin-top:8px; text-align:right">
        <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
export default {
  mounted() {},

  created() {
    this.projectId = this.$route.params.projectId;

    this.$api
      .DEVICE_QUERY_FOR_PAGE({ productId: this.$route.params.projectId })
      .then((res) => {
        this.deviceList = res.records;
      })
      .catch((err) => {});
  },
  data() {
    return {
      deviceList: [],
      searchParam: {},
    };
  },
  methods: {
    goBack() {},
  },
};
</script>