<template>
  <d2-container class="cloudfunc-container">
    <el-card class="box-card" style="min-height:99%">
      <!-- 页头 -->
      <el-page-header slot="header" @back="goBack" :content="pageTitle" />
      <!-- 检索表单 -->
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="searchParams.label" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.enable" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="newCloudfuncDialog.show = true">新建</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <el-table border :data="cloudfuncPage.data">
        <el-table-column prop="label" label="名称"></el-table-column>
        <el-table-column width="80px" label="启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="testCloudfunc(scope.row)" size="small" plain>测试</el-button>
            <el-button @click="showDetailDialog(scope.row)" size="small" plain>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top:20px;text-align:right">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-sizes="cloudfuncPage.size"
          :total="cloudfuncPage.total"
        ></el-pagination>
      </div>

      <!-- 查看脚本弹窗 -->
      <el-dialog title="云函数详情" :visible.sync="cloudfuncDetailDialog.show">
        <el-form label-width="100px">
          <el-form-item label="ID" hidden>
            <el-input v-model="cloudfuncDetailDialog.data.id" hidden></el-input>
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="cloudfuncDetailDialog.data.enable"></el-switch>
          </el-form-item>
          <el-form-item label="Token">
            <el-input :value="cloudfuncDetailDialog.data.token" placeholder="Token" disabled></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="cloudfuncDetailDialog.data.label" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="cloudfuncDetailDialog.data.description" placeholder="描述"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <editor
              width="800px"
              height="400px"
              ref="editor"
              :theme="'monokai'"
              :content="cloudfuncDetailDialog.data.script"
              :options="editorOptions"
              :fontSize="14"
              :lang="'js'"
              @init="editorInit"
            >
              <div>*云函数内容*</div>
            </editor>
          </el-form-item>
          <el-form-item style="padding-top:30px">
            <el-button type="primary" @click="editCloudfunc">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 新建 -->
      <el-dialog title="新建云函数" :visible.sync="newCloudfuncDialog.show">
        <el-form label-width="100px">
          <el-form-item label="ID" hidden>
            <el-input v-model="newCloudfuncDialog.data.id" hidden></el-input>
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="newCloudfuncDialog.data.enable" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="newCloudfuncDialog.data.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="newCloudfuncDialog.data.description" placeholder="描述"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <editor
              width="800px"
              height="400px"
              ref="editor"
              :theme="'monokai'"
              :content="newCloudfuncDialog.data.script"
              :options="editorOptions"
              :fontSize="14"
              :lang="'js'"
              @init="editorInit"
            >
              <div>*云函数内容*</div>
            </editor>
          </el-form-item>
          <el-form-item style="padding-top:30px">
            <el-button type="primary" @click="editCloudfunc">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </d2-container>
</template>

<script>
import Editor from "vue2x-ace-editor";
import ace from "brace";
import "brace/ext/language_tools";
import "brace/mode/python";
import "brace/snippets/python";
import "brace/theme/eclipse";
require("brace/ext/language_tools");
require("brace/mode/python");
require("brace/snippets/python");
require("brace/theme/eclipse");
export default {
  name: "cloudfunc",
  components: {
    Editor,
  },
  data() {
    return {
      pageTitle: "云端函数",
      //page
      cloudfuncPage: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
        loading: false,
      },
      // search
      searchParams: {
        label: null,
        enable: false,
      },
      //
      editorOptions: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        tabSize: 2,
      },
      //
      newCloudfuncDialog: {
        data: {
          id: -1,
          enable: false,
          name: "",
          description: "",
          script:
            "/**\n" +
            "* Callback function\n" +
            "*/\n" +
            "function call(request, cloud){\n" +
            "  // TODO\n" +
            "  cloud.return('HelloWorld');\n" +
            "}\n",
        },
        show: false,
      },
      //
      statusOptions: [
        {
          value: true,
          label: "启用",
        },
        {
          value: false,
          label: "关闭",
        },
      ],
      //
      cloudfuncDetailDialog: {
        data: {
          id: 0,
          enable: false,
          name: "",
          description: "",
          script: "",
        },
        show: false,
      },
    };
  },
  mounted() {
    const params = {
      current: this.cloudfuncPage.current,
      size: this.cloudfuncPage.size,
    };
    this.getCloudfuncList(params);
  },
  methods: {
    goBack() {},
    //
    getCloudfuncList(params) {
      this.cloudfuncPage.loading = true;
      this.$api
        .CLOUDFUNC_LIST(params)
        .then((res) => {
          this.cloudfuncPage.data = res.records;
          this.cloudfuncPage.total = res.total;
          this.cloudfuncPage.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.cloudfuncPage.loading = false;
        });
    },
    //
    onSearch() {
      this.getCloudfuncList(this.searchParams);
    },
    // 查看脚本
    showDetailDialog(row) {
      this.cloudfuncDetailDialog.data = row;
      this.cloudfuncDetailDialog.show = true;
    },
    //
    editCloudfunc() {
      const data = this.newCloudfuncDialog.data;
      console.log(data);
      // this.$api.CLOUDFUNC_CREATE()
      //   .then(res=>{
      //     this.$message.success('添加成功')
      //   })
      //   .catch(err=>{
      //     console.log(err)

      //   })
    },
    //
    testCloudfunc(id) {
      this.$message({
        message: "测试成功",
        type: "success",
      });
    },
    //
    editorInit() {},
  },
};
</script>

<style>
</style>
