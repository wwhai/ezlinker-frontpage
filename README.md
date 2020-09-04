# EZLinker Frontpage
## 1. 整体规范
整体规范参考阿里巴巴开发手册
## 2. 内部规范
### 1. 目录规范
1. 页面全部放在项目下的：views；
2. 每个模块集合，单独新建目录；
3. 每个模块目录结构：
```
｜模块
｜---- pages：页面
      ｜---- index.vue:首页

如果有CURD业务，命名规范如下
|---- pages：页面
    |----- 编辑：editXXX.vue
    |----- 详情：xxxDetail.vue
    |----- component：自定义组件
```

### 2. 表数据规范
下面给出一个基础模板，务必按照规范来实现
```js
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
```

对应的后端接口
```java
    @GetMapping
    public R queryForPage(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false, defaultValue = "1") Integer current,
            @RequestParam(required = false, defaultValue = "20") Integer size,
            /*其他参数*/) {
        return data(数据);//有数据
        return R.ok();//无数据
    }
```
注意事项：
1. current，size不是必传参数，要求都要有默认值；
2. 列表必须返回Page结果；
3. 每次操作完以后，如有需要可返回数据，不强制；