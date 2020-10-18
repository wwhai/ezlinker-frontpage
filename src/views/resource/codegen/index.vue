<template>
  <d2-container class="project-device-container">
    <el-form :model="genCode" status-icon label-width="100px">
      <el-form-item label="数据名称" prop="name">
        <el-input type="text" v-model="genCode.name"></el-input>
      </el-form-item>
      <el-form-item label="API名称" prop="apiName">
        <el-input type="text" v-model="genCode.apiName"></el-input>
      </el-form-item>
    </el-form>

    <h1>数据</h1>
    <pre>
    <span style = "color:red">{{ genCode.name }}</span>: {
    data: [],
    current: 0,
    size: 10,
    total: 0
    }
    </pre>
    <h1>表格</h1>
    <pre v-text="table"></pre>
    <h1>函数</h1>
    <pre>
get<span style = "color:red">{{ genCode.name }}</span>() {
      let params = {
        current: this.<span style = "color:red">{{ genCode.name }}</span>.current,
        size: this.<span style = "color:red">{{ genCode.name }}</span>.size,
      };
      this.$api
        .{{ genCode.apiName }}(params)
        .then((result) => {
          this.<span style = "color:red">{{ genCode.name }}</span>.data = res.records;
          this.<span style = "color:red">{{ genCode.name }}</span>.total = res.total;
          this.<span style = "color:red">{{ genCode.name }}</span>.pages = res.pages;
          this.<span style = "color:red">{{ genCode.name }}</span>.size = res.size;
        })
        .catch((err) => {});
}
    </pre>
    <h1>分页</h1>
    <pre
      ><span style = "color:red">{{ genCode.name }}</span>Pagenation(current) {
    this.<span style = "color:red">{{ genCode.name }}</span>.current = current;
    this.get<span style = "color:red">{{ genCode.name }}</span>();
    }
    </pre>
  </d2-container>
</template>

<script>
export default {
  data() {
    return {
      table:
        '<el-table :data="deviceData.data" height="600px">\n' +
        '<el-table-column prop="data" label="数据记录"></el-table-column>\n' +
        "</el-table>\n" +
        '<div style="margin-top: 20px; text-align: right">\n' +
        "<el-pagination\n" +
        "backg\n" +
        'layout="total, prev, pager, next"\n' +
        '@current-change="deviceDataPagenation"\n' +
        ':current-page.sync="deviceData.current"\n' +
        ':page-size="deviceData.size"\n' +
        ':total="deviceData.total">\n' +
        "</el-pagination>\n" +
        "</div>\n",
      genCode: {
        name: "",
        apiName: "",
      },
    };
  },
};
</script>
