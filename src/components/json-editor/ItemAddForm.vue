<template>
  <div class="add-item-form">
    <div class="pair-input">
      <!-- key输入 -->
      <el-input
        type="text" size='mini'
        v-model="keyName"
        v-if="needName"
        class="key-input" 
        placeholder="name" />
      <!-- 类型选择 -->
      <el-select v-model="formatSelected" size='mini' class="val-select">
        <el-option v-for="(item, index) in formats"
          :value="item" :key="index">
          {{item}}
        </el-option>
      </el-select>

      <!-- 值输入 -->
      <template v-if="formatSelected !='array' && formatSelected != 'object'">
        <el-input
          type="text" size='mini'
          v-model="valName"
          class="val-input"
          placeholder="value"
          v-if="formatSelected == 'string'"
        />
        <el-input
          type="number" size='mini'
          v-model="valName"
          class="val-input"
          placeholder="value"
          v-if="formatSelected == 'number'"
          @change="dealNumber"
        />
        <el-select
          name="value" size='mini'
          v-model="valName"
          class="val-input"
          v-if="formatSelected == 'boolean'"
          @change="dealBoolean"
        >
          <el-option :label='true' :value="true"></el-option>
          <el-option :label='false' :value="false"></el-option>
        </el-select>
      </template>
    </div>

    <div class="tools">
      <el-button type='primary' size='mini' class="" @click="confirm">
        {{ this.formBtnText.confirmText }}
      </el-button>
      <el-button class="" size='mini' @click="cancel">
        {{ this.formBtnText.cancelText }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemAddForm',
  data () {
    return {
      formats: ['string', 'array', 'object', 'number', 'boolean'],
      formatSelected: 'string',
      //--
      keyName: '',
      valName: ''
    };
  },
  props: {
    needName: {
      default: true
    }
  },
  inject: ['formBtnText'],
  methods: {
    confirm: function() {
      let val = null;
      if (this.formatSelected === 'array' || this.formatSelected === 'object') {
        val = [];
      } else {
        val = this.valName;
      }

      let objData = {
        key: this.needName ? this.keyName : null,
        val: val,
        type: this.formatSelected
      };

      this.$emit('confirm', objData);
      this.keyName = '';
      this.valName = '';
      this.formatSelected = 'string';
    },

    cancel: function() {
      this.$emit('cancel');
    },

    dealBoolean: function() {
      this.valName = Boolean(this.valName);
    },

    dealNumber: function() {
      this.valName = Number(this.valName);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-item-form{
  display: flex;
  .pair-input{
    display: flex;
    .key-input{
      width: 140px;
      margin-right: 10px;
    }
    .val-select{
      width: 100px;
      margin-right: 10px;
    }
    .val-input{
      width: 140px;
      margin-right: 10px;
    }
  }
  .tools{
    display: flex;
    // margin-left: 10px;
  }
}
</style>