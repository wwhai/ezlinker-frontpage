<template>
  <div class="param-box">
    <div class="item" v-for="(param, i) in value" :key="i">
      <span class="elem field">
        <el-input placeholder="字段名" v-model="value[i].field" required />
      </span>
      <span class="elem field">
        <el-select
          v-model="param.fieldType"
          @change="changeType(i, param.fieldType)"
          placeholder="字段类型"
        >
          <el-option :label="'数字'" :value="'NUMBER'"></el-option>
          <el-option :label="'布尔'" :value="'BOOLEAN'"></el-option>
          <el-option :label="'文本'" :value="'TEXT'"></el-option>
          <el-option :label="'流媒体'" :value="'STREAM'"></el-option>
          <el-option :label="'坐标'" :value="'GEO'"></el-option>
        </el-select>
      </span>
      <span class="elem field">
        <el-input
          v-if="value[i].fieldType == 'GEO'"
          disabled
          v-model="value[i].unit"
        />
        <el-input
          v-if="value[i].fieldType == 'BOOLEAN'"
          disabled
          v-model="value[i].unit"
        />
        <el-input
          v-else-if="value[i].fieldType == 'NUMBER'"
          v-model="value[i].unit"
          placeholder="单位"
        />
        <el-input
          v-else-if="value[i].fieldType == 'TEXT'"
          placeholder="单位"
          v-model="value[i].unit"
        />
        <el-input
          v-else-if="value[i].fieldType == 'STREAM'"
          disabled
          v-model="value[i].unit"
        />
      </span>
      <span class="elem field">
        <el-input
          v-if="value[i].fieldType == 'NUMBER'"
          placeholder="0"
          :value="value[i].defaultValue"
          v-model="value[i].defaultValue"
        />
        <el-input
          v-else-if="value[i].fieldType == 'BOOLEAN'"
          placeholder="false"
          :value="value[i].defaultValue"
          disabled
          v-model="value[i].defaultValue"
        />
        <el-input
          v-else-if="value[i].fieldType == 'TEXT'"
          placeholder="NULL"
          :value="value[i].defaultValue"
          v-model="value[i].defaultValue"
        />
        <el-input
          v-else-if="value[i].fieldType == 'STREAM'"
          placeholder="流媒体"
          disabled
          :value="value[i].defaultValue"
          v-model="value[i].defaultValue"
        />
        <el-input
          v-else-if="value[i].fieldType == 'GEO'"
          placeholder="0,0"
          disabled
          :value="value[i].defaultValue"
          v-model="value[i].defaultValue"
        />
      </span>
      <span class="elem desc">
        <el-input placeholder="备注" v-model="value[i].description" max="50" />
      </span>
      <span class="elem close" @click="removeParam(i)">
        <d2-icon name="close" />
      </span>
    </div>
    <div class="item add-btn" @click="addParam()">
      <d2-icon name="plus" />新增
    </div>
  </div>
</template>

<script>
export default {
  name: "parameter",
  props: {
    value: Array,
  },
  watch: {
    value(value) {
      for (let index = 0; index < this.value.length; index++) {
        let element = this.value[index];
        console.log("AAAAAA", element);
      }
    },
  },
  methods: {
    changeType(i, t) {
      this.value[i].fieldType = t;
    },
    addParam() {
      if (this.value.length > 20) {
        this.$notify({
          title: "属性过多",
          message: "属性不可超过20个",
          type: "warning",
        });
      } else {
        this.value.push({
          field: "",
          unit: null,
          fieldType: "NUMBER",
          defaultValue: null,
          description: null,
        });
      }
    },
    removeParam(index) {
      this.value.splice(index, 1);
    },
  },
};
</script>

<style lang='scss'>
.param-box {
  width: 700px;
  .item {
    font-size: 12px;
    height: 32px;
    .elem {
      display: inline-block;
      width: 20%;
      z-index: 9;
      .el-input__inner {
        height: 32px;
        border-radius: 0px;
      }
      &:hover {
        z-index: 9999;
        border-color: rgb(36, 35, 35);
      }
    }
    .elem + .elem {
      margin-left: -1px;
    }
    .field {
      width: 120px;
    }
    .desc {
      width: 190px;
    }
    .close {
      width: 20px;
      height: 24px;
      color: rgb(190, 22, 22);
      font-size: 20px;
      margin-left: 10px;
      padding-left: 10px;
      padding-bottom: 4px;
      text-align: center;
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
  .item + .item {
    margin-top: 14px;
  }
  .add-btn {
    border: 1px dashed #ddd;
    text-align: center;
    color: #999;
    cursor: pointer;
    &:hover {
      border-color: #999;
      color: #555;
    }
    .fa {
      margin-right: 6px;
    }
  }
}
</style>
