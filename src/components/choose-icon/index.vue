<template>
  <div class="choose-icon-container">
    <div class="icon-box" @click="visible=true">
      <img v-if="curr" :src="curr"/>
      <d2-icon v-else name='plus'/>
    </div>
    <el-dialog title="选择图标" class="icon-dialog"
      :visible.sync="visible" :modal='false'>
      <div class="list" >
        <img class="item" v-for="(item,index) in list" :key="'icon'+index"
        @click="choose(item)" :src="item"/>
      </div>
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
      curr: '',
      visible: false
    }
  },
  mounted () {
    this.curr = this.init ? this.init : ''
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
    z-index: 9999!important;
    .list{
      display: flex;
      // justify-content: space-around;
      .item{
        width: 48px;
        height: 48px;
        margin: 5px 10px;
      }
    }
  }
}
</style>
