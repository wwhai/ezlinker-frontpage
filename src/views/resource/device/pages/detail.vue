<template>
  <d2-container class="project-container">
    <el-card class="box-card">
      <!-- 页头 -->
      <div slot="header" class="clearfix">
        <el-page-header @back="goBack">
          <template slot="content">设备详情</template>
        </el-page-header>
      </div>
    </el-card>
  </d2-container>
</template>
<script>
export default {
  name: "DeviceDetail",
  data() {
    return {};
  },
  methods: {
    goBack() {
      let productId = this.$route.params.productId;
      this.$router.push("project/:projectId/device".replace(":projectId", 1));
    },
  },
  created() {},
};
</script>