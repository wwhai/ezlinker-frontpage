<template>
  <div class="block_content array">
    <ol class="array-ol">
      <draggable v-model="value" handle=".dragbar" @end="onDragEnd">
        <li
          v-for="(item, index) in value"
          :key="`${item.type}${index}`"
          :class="['array-item', ]"
        >
          <template v-if="item.type !== 'object' && item.type !== 'array'">
            <el-input
              type="text" size='mini'
              v-model="item.remark"
              class="val-input"
              v-if="item.type === 'string'"
              placeholder="string"
            />
            <el-input
              type="number" size='mini'
              v-model.number="item.remark"
              class="val-input"
              v-if="item.type == 'number'"
              placeholder="number"
              @input="numberInputChange(item)"
            />
            <el-select
              name="value" size='mini'
              v-model="item.remark"
              class="val-select"
              v-if="item.type == 'boolean'"
            >
              <el-option :label="true" :value="true"></el-option>
              <el-option :label="false" :value="false"></el-option>
            </el-select>
          </template>
          <div v-else>
            <span :class="['json-key', 'json-desc']">
              {{item.type.toUpperCase()}}
              <i
                class="collapse-down el-icon-arrow-down"
                v-if="item.type == 'object' || item.type == 'array'"
                @click="closeBlock(index, $event)"
              ></i>
              <i v-if="item.type == 'object'">{{'{' + item.childParams.length + '}'}}</i>
              <i v-if="item.type == 'array'">{{'[' + item.childParams.length + ']'}}</i>
            </span>

            <span class="json-val" :class="{'hide-item': hideMyItem[index] == true}">
              <template v-if="item.type == 'array'">
                <array-view :parsedData="item.childParams || []" v-model="item.childParams"></array-view>
              </template>

              <template v-if="item.type == 'object'">
                <json-view :parsedData="item.childParams || {}" v-model="item.childParams"></json-view>
              </template>
            </span>
          </div>

          <el-select size='mini' v-model="item.type" class="type-select" @change="itemTypeChange(item)">
            <el-option v-for="(item, index) in formats" :value="item" :key="index">{{item}}</el-option>
          </el-select>
          <div class="tools">
            <!-- 拖拽按钮 -->
            <el-tooltip effect="dark" content="点住进行拖拽" placement="right-start">
              <d2-icon name='align-justify' class="dragbar drag-bar"/>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="点击删除该行" placement="top-start">
              <i class="del-btn el-icon-delete" @click="delItem(value, item, index)"></i>
            </el-tooltip>
          </div>
        </li>
      </draggable>
    </ol>

    <item-add-form v-if="toAddItem" @confirm="newItem" @cancel="cancelNewItem" :needName="false"></item-add-form>

    <div class="block add-key" v-if="!toAddItem" @click="addItem">
      <d2-icon name='plus' />
    </div>
  </div>
</template>

<script>
import ItemAddForm from "./ItemAddForm.vue";

export default {
  name: "ArrayView",
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  data: function() {
    return {
      formats: ["string", "array", "object", "number", "boolean"],
      // flowData: this.parsedData,
      toAddItem: false,
      hideMyItem: {}
    };
  },
  watch: {
    // parsedData: function(newValue, oldValue) {
    //     console.log(newValue, oldValue)
    //     this.flowData = this.parsedData || [];
    //     console.log(this.flowData, this.parsedData)
    //   }
    
  },
  components: {
    "item-add-form": ItemAddForm,
    "json-view": () => import("./JsonView.vue")
  },
  methods: {
    delItem: function(parentDom, item, index) {
      this.value.splice(index, 1);
      if (this.hideMyItem[index]) this.hideMyItem[index] = false;
      this.$emit("input", this.value);
    },

    addItem: function() {
      this.toAddItem = true;
    },

    cancelNewItem: function() {
      this.toAddItem = false;
    },

    closeBlock: function(index, e) {
      this.$set(this.hideMyItem, index, this.hideMyItem[index] ? false : true);
    },

    newItem: function(obj) {
      this.toAddItem = false;

      let oj = {
        name: obj.key,
        label: obj.key,
        type: obj.type
      };
      if (obj.type == "array" || obj.type == "object") {
        oj.childParams = obj.val;
        oj.remark = null;
      } else {
        oj.childParams = null;
        oj.remark = obj.val;
      }
      const data = [ ...this.value]
      data.push(oj)
      // this.value.push(oj);
      this.$emit("input", data);
      this.cancelNewItem();
      console.log(data)
    },

    onDragEnd: function() {
      this.$emit("input", this.value);
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
.array-ol{
  padding: 0;
  margin: 8px 0;
  .array-item{
    margin: 4px 0;
    display: flex;
    .val-input{
      width: 140px;
    }
    .val-select{
      width: 100px;
      // margin-left: 10px;
    }
    .type-select{
      width: 100px;
      margin-left: 10px;
    }
    .hide-item{
      display: none;
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
}
</style>