<template>
  <div class="choose-icon-container">
    <!-- 显示图标 -->
    <div class="icon-box" @click="visible=true">
      <img v-if="init" :src="init" alt="项目图标"/>
      <d2-icon v-else name='plus'/>
    </div>
    <!-- 图标选择列表 -->
    <el-dialog title="选择图标" class="icon-dialog" style="z-index: 9999"
      :visible.sync="visible" :modal='false'>
      <div class="list" >
        <img class="item" v-for="(item,index) in list" :key="'icon'+index"
        @click="choose(item)" :src="item" alt="项目图标"/>
      </div>
      <!-- TODO 图标分页预留 -->
      <!-- <el-pagination class="icon-page" layout="prev, pager, next" :total="1000"></el-pagination> -->
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
export default {
  name: 'choose-icon',
  props: {
    init: String,
    handle: Function
  },
  data () {
    return {
      list: [],
      visible: false
    }
  },
  mounted () {
    this.getIcon()
  },
  methods: {
    getIcon () {
      api.PROJECT_ICON().then(res => {
        this.list = res
      })
    },
    choose (item) {
      // console.log('click',e)
      this.curr = item
      this.handle(item)
    }
  }
}
</script>

<style lang='scss'>
.choose-icon-container{
  .icon-box{
    width: 100px;
    height: 100px;
    text-align: center;
    // line-height: 100px;
    border: 1px solid #ccc;
    &:hover{
      border-color: #999;
      color: #666;
    }
    img{
      width: 100%;
    }
  }
  .icon-dialog{
    // position: absolute;
    // z-index: 9999!important;
    .list{
      display: flex;
      // justify-content: space-around;
      .item{
        width: 48px;
        height: 48px;
        margin: 5px 10px;
      }
    }
    .icon-page{
      margin-top: 10px;
    }
  }
}
</style>
