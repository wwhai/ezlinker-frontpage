<template>
  <div class="json-view">
    <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
      <div class="json-pair"
        v-for="(item, index) in flowData" :key="`${item.type}${index}`"
        :class="['block', 'clearfix', ]"
      >
        <div class="json-main">
          <!-- 输入key -->
          <span class="json-key">
            <i class="collapse-down el-icon-arrow-down"
              v-if="item.type == 'object' || item.type == 'array'"
              @click="closeBlock(index, $event)"
            ></i>
            <el-input
              type="text" size='mini'
              v-model="item.name"
              class="key-input"
              v-if="typeof item.name == 'string'"
              @blur="keyInputBlur(item, $event)"
            />
            <i v-if="item.type == 'object'" class="count">{{'{' + item.childParams.length + '}'}}</i>
            <i v-if="item.type == 'array'" class="count">{{'[' + item.childParams.length + ']'}}</i>
          </span>
          <!-- 输入value -->
          <span class="json-val">
            <!-- 类型为基本值类型 -->
            <template v-if="item.type !== 'object' && item.type !== 'array'">
              <span class="val">
                <el-input
                  type="text"  size='mini'
                  v-model="item.remark"
                  class="val-input"
                  v-if="item.type == 'string'"
                />
                <el-input
                  type="number"  size='mini'
                  v-model.number="item.remark"
                  class="val-input"
                  v-if="item.type == 'number'"
                  @input="numberInputChange(item)"
                />
                <el-select
                  name="value"  size='mini'
                  v-model="item.remark"
                  class="val-select"
                  v-if="item.type == 'boolean'"
                >
                  <el-option :label='true' :value="true"></el-option>
                  <el-option :label='false' :value="false"></el-option>
                </el-select>
              </span>
            </template>
          </span>

          <!-- 类型选择 -->
          <el-select size='mini' v-model="item.type" class="type-select" @change="itemTypeChange(item)">
            <el-option v-for="(type, index) in formats" :label='type' :value="type" :key="index"></el-option>
          </el-select>
          <div class="tools">
            <!-- 拖拽按钮 -->
            <el-tooltip effect="dark" content="点住进行拖拽" placement="right-start">
              <d2-icon name='align-justify' class="dragbar drag-bar"/>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="点击删除该行" placement="top-start">
              <i class="del-btn el-icon-delete" @click="delItem(parsedData, item, index)"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="sub" :class="{'hide-block': hideMyBlock[index] == true}">
            <!-- 类型为Object -->
            <template v-if="item.type == 'object'">
              <json-view :parsedData="item.childParams" v-model="item.childParams"></json-view>
            </template>
            <!-- 类型为Array -->
            <template v-else-if="item.type == 'array'">
              <array-view :parsedData="item.childParams" v-model="item.childParams"></array-view>
            </template>
        </div>
      </div>
    </draggable>
    
    <!-- 建立新键值对 -->
    <item-add-form class="add add-item" v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem"></item-add-form>
    <!-- 添加按钮 -->
    <template v-else>
      <el-button class="add add-btn" v-if="top" type='info' size='mini' @click="addItem" >
        <d2-icon name='plus'/>
      </el-button>
      <div class="add add-btn" v-else @click="addItem">
        <d2-icon name='plus' />
      </div>
    </template>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";
// import Draggable from 'vuedraggable'

export default {
  name: "JsonView",
  components:{
    // Draggable,
  },
  props: { 
    parsedData: {},
    top: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      formats: ["string", "array", "object", "number", "boolean"],
      flowData: this.parsedData,
      toAddItem: false,
      hideMyBlock: {}
    };
  },
  created() {
    this.flowData = this.parsedData || {};
  },
  watch: {
    parsedData: {
      handler(newValue, oldValue) {
        this.flowData = this.parsedData;
      }
    }
  },
  components: {
    "item-add-form": ItemAddForm,
    "array-view": () => import("./ArrayView.vue")
  },
  methods: {
    delItem: function(parentDom, item, index) {
      this.flowData.splice(index, 1);
      if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
      this.$emit("input", this.flowData);
    },

    closeBlock(index, e) {
      this.$set(
        this.hideMyBlock,
        index,
        this.hideMyBlock[index] ? false : true
      );
    },

    addItem: function() {
      this.toAddItem = true;
    },

    cancelNewItem: function() {
      this.toAddItem = false;
    },

    newItem: function(obj) {
      let oj = {
        name: obj.key,
        type: obj.type
      };
      if (obj.type == "array" || obj.type == "object") {
        oj.childParams = obj.val;
        oj.remark = null;
      } else {
        oj.childParams = null;
        oj.remark = obj.val;
      }

      if (!oj.name) {
        alert("please must input a name!");
        return;
      } else {
        this.flowData.push(oj);
        this.$emit("input", this.flowData);
        this.cancelNewItem();
      }
    },

    keyInputBlur: function(item, e) {
      if (item.name.length <= 0) {
        alert("please must input a name!");
        // item.name = "null";
        e.target.focus();
      }
    },

    onDragEnd: function() {
      this.$emit("input", this.flowData);
    },

    itemTypeChange: function(item) {
      if (item.type === "array" || item.type === "object") {
        item.childParams = [];
        item.remark = null;
      }
      if (item.type === "boolean") {
        item.remark = true;
      }
      if (item.type === "string") {
        item.remark = "";
      }
      if (item.type === "number") {
        item.remark = 0;
      }
    },

    numberInputChange: function(item) {
      if (!item.remark) item.remark = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.json-view{
  .json-pair{
    // margin: 4px 0;
    .json-main{
      display: flex;
      .json-key{
        .collapse-down{
          padding: 4px;
        }
        .key-input{
          width: 140px;
        }
        .count{
          padding: 0 6px;
        }
      }
      .json-val{
        margin-left: 10px;
        .val{
          .val-input{
            width: 140px;
          }
          .val-select{
            width: 100px;
            margin-left: 10px;
          }
        }
      }
      .type-select{
        margin-left: 8px;
        width: 100px;
      }
      .tools{
        margin-left: 10px;
        padding: 4px 0;
        .drag-bar{
          font-size:20px;
        }
        .del-btn{
          margin-left: 8px;
          font-size:20px;
          cursor: pointer;
        }
      }
    }
    .sub{
      padding-left: 24px;
    }
  }
  .json-pair + .json-pair{
    margin-top: 10px;
  }
  .hide-block{
    display: none;
  }
  .add{
    margin-top: 10px;
  }
}
</style>