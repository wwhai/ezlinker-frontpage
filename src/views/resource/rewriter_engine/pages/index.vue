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
        <el-form-item label="名称">
          <el-input v-model="searchParam.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="searchParam.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchParam.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showNewRwEngineDialog">新建规则</el-button>
        </el-form-item>
      </el-form>
      <!-- 对话框 -->
      <el-dialog title="新建规则" :visible.sync="newRwEngineDialog.show" width="500px">
        <el-form
          :model="newRwEngineDialog.data"
          :label-position="newRwEngineDialog.labelPosition"
          label-width="80px"
        >
          <el-form-item label="规则名称">
            <el-input v-model="newRwEngineDialog.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="规则名称">
            <el-input v-model="newRwEngineDialog.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="规则名称">
            <el-input v-model="newRwEngineDialog.data.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="规则类型">
            <el-select v-model="newRwEngineDialog.data.type" placeholder="请选择规则类型">
              <el-option label="HTTP转发" value="http"></el-option>
              <el-option label="Kafaka转发" value="kafuka"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newRwEngineDialog.show = false">取 消</el-button>
          <el-button type="primary" @click="newRwEngineSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- ------- -->
      <!-- 数据表格 -->
      <el-table stripe :data="rwEngineRecords.tableData" border style="width: 100%" height="700px">
        <el-table-column prop="name" label="规则名称" width="300"></el-table-column>
        <el-table-column prop="description" label="规则描述" width="400"></el-table-column>
        <el-table-column prop="type" label="规则类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1" size="mini" plain type="primary">HTTP引擎</el-tag>
            <el-tag v-if="scope.row.type == 2" size="mini" plain type="success">其他规则</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top:8px; text-align:right">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="onCurrentPageChange"
          :page-size="rwEngineRecords.size"
          :total="rwEngineRecords.total"
        ></el-pagination>
      </div>
    </el-card>
  </d2-container>
</template>

<script>
export default {
  mounted() {},

  created() {
    this.getRwEngineData(this.searchParam);
  },
  data() {
    return {
      // 页面头部标题
      pageTitle: "分发引擎",
      newRwEngineDialog: {
        labelPosition: 'right',
        show: false,
        data: {
          name: "",
          type: "http",
          description: "",
          script: "",
        },
      },
      // 多个结果用XXXRecords
      rwEngineRecords: {
        current: 1,
        size: 10,
        total: 0,
        pages: 0,
        tableData: [],
      },
      //搜索条件
      searchParam: {
        current: 1,
        size: 10,
      },
    };
  },
  methods: {
    // 分页事件响应
    onCurrentPageChange(currentPage) {
      this.searchParam.current = currentPage;
      this.getRwEngineData(this.searchParam);
    },
    // 新建
    showNewRwEngineDialog() {
      this.newRwEngineDialog.show = true;
    },
    newRwEngineSubmit() {},
    // 加载数据函数，命名规范：getXXXData(参数)
    // ！！！ 注意：在lambda表达式，this统一叫thiz；
    getRwEngineData(param) {
      let thiz = this;
      thiz.$api
        .RWENGINE_QUERY_FOR_PAGE(param)
        .then((res) => {
          console.log("======+>", res);
          //
          thiz.rwEngineRecords.tableData = res.records;
          thiz.rwEngineRecords.current = res.current;
          thiz.rwEngineRecords.size = res.size;
          thiz.rwEngineRecords.total = res.total;
          thiz.rwEngineRecords.pages = res.pages;
          //
          thiz.searchParam.size = res.size;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 条件检索
    search() {
      this.getRwEngineData(this.searchParam);
    },
    // 历史回退
    goBack() {
      this.$router.push("/rewriteEngine");
    },
  },
};
</script>