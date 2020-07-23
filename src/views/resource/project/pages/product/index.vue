<template>
  <d2-container class="product-container">
    <!-- 统计信息 -->
    <div class="stat">
      <div class="item">
        <div class="title">全部产品</div>
        <div class="count">6</div>
      </div>
      <div class="item">
        <div class="title">开发中</div>
        <div class="count">1</div>
      </div>
      <div class="item">
        <div class="title">运行中</div>
        <div class="count">2</div>
      </div>
      <div class="item">
        <div class="title">已锁定</div>
        <div class="count">3</div>
      </div>
    </div>
    <!-- 产品列表 -->
    <div class="list-box">
      <div class="list-head">
        <div class="title">产品列表</div>
        <div class="right">
          <span class="type-list">
            <span class="" data-type='0'>全部产品</span>
            <span class="" data-type='0'>开发中</span>
            <span class="" data-type='0'>运行中</span>
            <span class="" data-type='0'>已锁定</span>
          </span>
          <span class="input-box">
            <el-input placeholder="请输入内容" v-model="input3" 
              class="input-with-select" size="small">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </span>
        </div>
      </div>
      <div class="list-body">
        <div class="add-btn">
            <span class="btn"><d2-icon name="plus"/>新增</span>
        </div>
        
      </div>
    </div>
  </d2-container>
</template>

<script>
import api from '@/api'
export default {
  name: 'project-product',
  data(){
    return {
      id: 0,
      stat:{
        all: 0,
        dev: 0,
        run: 0,
        lock: 0,
      },
      product:{
        list:[],
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  mounted(){
    this.id = this.$route.params.projectId
    this.productList()
  },
  methods:{
    productList(){
      const that = this
      const params = {
        projectId: that.id,
        current: that.product.current,
        size: that.product.size,
      }
      api.PRODUCT_LIST(params).then(res=>{
        that.product.list = res.records
        that.product.total = res.total
      })
    }
  }
}
</script>

<style lang='scss'>
.product-container{
  .stat{
    display: flex;
    justify-content: space-between;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .item{
      text-align: center;
      width: 25%;
      .title{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 5px;
      }
      .count{
        font-size: 24px;

      }
    }
    .item + .item{
      border-left: 1px solid #f0f0f0;
    }
  }
  .list-box{
    margin-top: 28px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 24px;

    .list-head{
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      .title{}
      .right{

        .type-list{
          span{
            color: rgba(0, 0, 0, 0.65);
            border: 1px solid #d7dae2;
            box-sizing: border-box;
            padding: 0 15px;
            height: 32px;
            display: inline-block;
            position: relative;
            cursor: pointer;
            &:hover{
              z-index: 1;
              border: 1px solid #303133;
              color: #303133;
            }
          }
          span + span{
            // border-left: 1px solid #d7dae2;
            margin-left: -1px;
          }
        }
        .input-box{
          width: 240px;
          margin-left: 20px;
          display: inline-block;
        }
      }
    }
    .list-body{
      margin-top: 20px;
      .add-btn{
        display: inline-block;
        border: 1px dashed #d9d9d9;
        text-align: center;
        width: 100%;
        line-height: 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        &:hover{
          border: 1px dashed #40475c;
          color: #40475c;
        }
        .btn{
          .fa{
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
