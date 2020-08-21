<template>
  <div class="module-container">
    <!-- 产品module列表 -->
    <div class="module-list">
      <div class="add-btn" @click="newModule">
          <span class="btn" ><d2-icon name="plus"/>新增</span>
      </div>
      <div class="item" v-for="(v,k) in data" :key="'module'+k">
        <div class="meta-box">
          <div class="icon-box">
            <img :src="v.icon" alt="icon"/>
          </div>
          <div class="meta">
            <div class="title">{{v.name}}</div>
            <div class="desc">{{v.description}}</div>
          </div>
        </div>
        <div class="edit-btn" @click="editModule(v)">
          编辑<d2-icon name='angle-right'/>
        </div>
      </div>
    </div>
    <!-- 选择模块模板 -->
    <el-drawer :visible.sync="template.visible" :modal='false'
      title="选择模板" class="module-temp-drawer">
      <module-template :data='template.data' :handle="editModule"/>
    </el-drawer>
    <!-- 编辑模块抽屉 -->
    <el-drawer :visible.sync="detail.visible" :modal='false'
      title="模块编辑" class="module-edit-drawer">
      <module-edit :data="detail.data" :hanlde="submitModule"/>
    </el-drawer>
  </div>
</template>

<script>
import ModuleTemplate from './module_template.vue'
import ModuleEdit from './module_edit.vue'

export default {
  name: 'product-module',
  components: {
    ModuleTemplate,
    ModuleEdit
  },
  props: {
    data: Array,
    id: Number
  },
  data () {
    return {
      detail: {
        data: {},
        visible: false
      },
      template: {
        data: [],
        visible: false
      }
    }
  },
  mounted () {
  },
  methods: {
    // 获取所有module template
    moduleTemplateAll () {
      const that = this
      this.$api.MODULE_TYPE_ALL().then(res => {
        var data = []
        for (const o of res) {
          data.push({
            icon: o.icon,
            type: o.name,
            name: o.label,
            protocol: o.protocol,
            model: o.model,
            description: o.description,
            dataAreas: []
          })
        }
        that.template.data = data
      })
    },
    newModule () {
      this.moduleTemplateAll()
      this.template.visible = true
    },
    editModule (item) {
      this.detail.data = { ...item, dataAreas: [...item.dataAreas] }
      this.template.visible = false
      this.detail.visible = true
    },
    submitModule (item) {
      const that = this
      const id = item.id
      const data = {
        productId: that.id, ...item
      }

      // id 为undefined，新建该module
      if (id == undefined) {
        that.$api.MODULE_TEMPLATE_CREATE(data).then(res => {
          that.detail.data = {}
          that.detail.visible = false
        })
        return
      }
      // 更新该module
      that.$api.MODULE_TEMPLATE_UPDATE(id, data).then(res => {
        that.detail.data = {}
        that.detail.visible = false
      })
    }
  }
}
</script>

<style lang='scss'>
.module-container{
  padding: 0 20px;
  .module-list{
    .item{
      text-align: center;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      padding: 10px 8px;
      margin-top: 20px;
      .meta-box{
        display: flex;
        .icon-box{
          width: 35px;
          height: 35px;
          border-radius: 5px;
          border: 1px solid rgba(0, 0, 0, 0.25);
          img{
            width: 100%;
          }
        }
        .meta{
          margin: 0 10px;
          text-align: left;
          .title{
            color: rgba(0, 0, 0, 0.65);
          }
          .desc{
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
          }
        }
      }
      .edit-btn{
        cursor: pointer;
        font-size: 14px;
        line-height: 37px;
        color: #777;
        &:hover{
          color: #333;
        }
        .fa{
          margin: 0 4px;
        }
      }
    }
    .item + .item{
      margin-top: 20px;
    }
    .add-btn{
      height: 36px;
      line-height: 38px;
      box-shadow: 0;
      border: 1px dashed #999;
      color: #555;
      display: block;
      text-align: center;
      cursor: pointer;
      &:hover{
        border-color: #333;
        color: #333;
      }
      .fa{
        margin-right: 8px;
      }
    }
  }
}
</style>
