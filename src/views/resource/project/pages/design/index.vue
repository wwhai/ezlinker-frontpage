<template>
  <!-- <d2-container class=""> -->
  <div class="design-container">
    <div class="tools">
      <div class="info">
          <div class="btn">
            <el-button type='primary' size='medium'>提交</el-button>
            <el-button size='medium'>取消</el-button>
          </div>
          <div class="name">产品: {{ product.name }}</div>
          <div class="desc">简介: {{ product.description }}</div>
        <div>
        </div>
      </div>
      <div v-for="(item, index) in tools" :key="index">
        <div class="title">{{ item.group }}</div>
        <div class="buttons">
          <a
            v-for="(btn, i) in item.children"
            :key="i"
            :title="btn.name"
            :draggable="btn.data"
            @dragstart="onDrag($event, btn)"
          >
            <i :class="`iconfont ${btn.icon}`"></i>
          </a>
        </div>
      </div>
    </div>
    <div id="topology-canvas" class="canvas" @contextmenu="onContextMenu($event)"></div>
    <!-- <div class="props" :style="props.expand ? 'overflow: visible' : ''">
      <CanvasProps :props.sync="props" @change="onUpdateProps" @hanlde="handle_save"></CanvasProps>
    </div> -->
    <div class="context-menu" v-if="contextmenu.left" :style="this.contextmenu">
      <CanvasContextMenu :canvas="canvas" :props.sync="props"></CanvasContextMenu>
    </div>
      </div>
  <!-- </d2-container> -->
</template>

<script>
import { Topology, Node, Line } from '@topology/core'
import * as FileSaver from 'file-saver'

import { Tools, canvasRegister } from './canvas'

import CanvasProps from './components/CanvasProps'
import CanvasContextMenu from './components/CanvasContextMenu'
import { mapState, mapActions } from 'vuex'

// let canvas
const canvasOptions = {
  rotateCursor: '/image/rotate.cur'
}

export default {
  data () {
    return {
      product: {},
      tools: Tools,
      props: {
        node: null,
        line: null,
        nodes: null,
        multi: false,
        expand: false,
        locked: false
      },
      contextmenu: {
        left: null,
        top: null,
        bottom: null
      },
      canvas: {}
    }
  },
  components: {
    CanvasProps,
    CanvasContextMenu
  },
  computed: {
    // event() {
    //   return this.$store.state.event.event
    // }
    ...mapState('d2admin/event', [
      'event'
    ])
  },
  created () {
    if (process.client && window.echartsData) {
      for (const key in window.echartsData) {
        document.body.removeChild(window.echartsData[key]).div
      }
      window.echartsData = {}
    }
    canvasRegister()
    document.onclick = event => {
      this.contextmenu = {
        left: null,
        top: null,
        bottom: null
      }
    }
  },
  mounted () {
    canvasOptions.on = this.onMessage
    this.canvas = new Topology('topology-canvas', canvasOptions)

    this.product.id = this.$route.params.productId
    // 页面挂载时显示设计图
    // this.open()
    this.getProduct()
  },
  methods: {
    ...mapActions('d2admin/canvas', [
      'data'
    ]),
    getProduct () {
      const that = this
      this.$api.PRODUCT_INFO(this.product.id).then(res => {
        that.product = res
        console.log(that.product)
      })
    },
    open (data) {
      this.canvas.open(data)
    },
    handle_save () {
      // 画布数据的json序列化
      const data = JSON.stringify(this.canvas.data)
      console.log('save data')
      console.log(this.canvas.data)
    },
    onDrag (event, node) {
      event.dataTransfer.setData('Text', JSON.stringify(node.data))
    },

    onMessage (event, data) {
      // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
      setTimeout(() => {
        switch (event) {
          case 'node':
          case 'addNode':
            this.props = {
              node: data,
              line: null,
              multi: false,
              expand: this.props.expand,
              nodes: null,
              locked: data.locked
            }
            break
          case 'line':
          case 'addLine':
            this.props = {
              node: null,
              line: data,
              multi: false,
              nodes: null,
              locked: data.locked
            }
            break
          case 'multi':
            this.props = {
              node: null,
              line: null,
              multi: true,
              nodes: data.length > 1 ? data : null,
              locked: this.getLocked({ nodes: data })
            }
            break
          case 'space':
            this.props = {
              node: null,
              line: null,
              multi: false,
              nodes: null,
              locked: false
            }
            break
          case 'moveOut':
            break
          case 'moveNodes':
          case 'resizeNodes':
            if (data.length > 1) {
              this.props = {
                node: null,
                line: null,
                multi: true,
                nodes: data,
                locked: this.getLocked({ nodes: data })
              }
            } else {
              this.props = {
                node: data[0],
                line: null,
                multi: false,
                nodes: null,
                locked: false
              }
            }
            break
          case 'resize':
          case 'scale':
          case 'locked':
            if (this.canvas && this.canvas.data) {
            //   console.log(this.$store)
              //   this.$store.commit('d2admin/canvas/data', {
              this.data({
                scale: this.canvas.data.scale || 1,
                lineName: this.canvas.data.lineName,
                fromArrowType: this.canvas.data.fromArrowType,
                toArrowType: this.canvas.data.toArrowType,
                fromArrowlockedType: this.canvas.data.locked
              })
            }
            break
        }
      }, 0)
    },

    getLocked (data) {
      let locked = true
      if (data.nodes && data.nodes.length) {
        for (const item of data.nodes) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      if (locked && data.lines) {
        for (const item of data.lines) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }

      return locked
    },

    onUpdateProps (node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      this.canvas.updateProps(node)
    },

    handle_new (data) {
      this.canvas.open({ nodes: [], lines: [] })
    },

    handle_open (data) {
      this.handle_replace(data)
    },

    handle_replace (data) {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = event => {
        const elem = event.srcElement || event.target
        if (elem.files && elem.files[0]) {
          const name = elem.files[0].name.replace('.json', '')
          const reader = new FileReader()
          reader.onload = e => {
            const text = e.target.result + ''
            try {
              const data = JSON.parse(text)
              if (
                data &&
                Array.isArray(data.nodes) &&
                Array.isArray(data.lines)
              ) {
                this.canvas.open(data)
              }
            } catch (e) {
              return false
            }
          }
          reader.readAsText(elem.files[0])
        }
      }
      input.click()
    },

    handle_savePng (data) {
      this.canvas.saveAsImage('le5le.topology.png')
    },

    handle_saveSvg (data) {
      const ctx = new C2S(this.canvas.canvas.width + 200, this.canvas.canvas.height + 200)
      for (const item of this.canvas.data.nodes) {
        item.render(ctx)
      }

      for (const item of this.canvas.data.lines) {
        item.render(ctx)
      }

      let mySerializedSVG = ctx.getSerializedSvg()
      mySerializedSVG = mySerializedSVG.replace(
        '<defs/>',
        `<defs>
    <style type="text/css">
      @font-face {
        font-family: 'topology';
        src: url('http://at.alicdn.com/t/font_1331132_h688rvffmbc.ttf?t=1569311680797') format('truetype');
      }
    </style>
  </defs>`
      )

      mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, '&#x')

      const urlObject = window.URL || window
      const export_blob = new Blob([mySerializedSVG])
      const url = urlObject.createObjectURL(export_blob)

      const a = document.createElement('a')
      a.setAttribute('download', 'le5le.topology.svg')
      a.setAttribute('href', url)
      const evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)
      a.dispatchEvent(evt)
    },

    handle_undo (data) {
      this.canvas.undo()
    },

    handle_redo (data) {
      this.canvas.redo()
    },

    handle_copy (data) {
      this.canvas.copy()
    },

    handle_cut (data) {
      this.canvas.cut()
    },

    handle_parse (data) {
      this.canvas.parse()
    },

    handle_state (data) {
      this.canvas.data[data.key] = data.value
      this.$store.commit('canvas/data', {
        scale: this.canvas.data.scale || 1,
        lineName: this.canvas.data.lineName,
        fromArrowType: this.canvas.data.fromArrowType,
        toArrowType: this.canvas.data.toArrowType,
        fromArrowlockedType: this.canvas.data.locked
      })
    },

    onContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()

      if (event.clientY + 360 < document.body.clientHeight) {
        this.contextmenu = {
          left: event.clientX + 'px',
          top: event.clientY + 'px'
        }
      } else {
        this.contextmenu = {
          left: event.clientX + 'px',
          bottom: document.body.clientHeight - event.clientY + 'px'
        }
      }
    }
  },
  destroyed () {
    this.canvas.destroy()
  }
}
</script>

<style lang="scss">
//引入toplogy所需字体文件
@import 'http://at.alicdn.com/t/font_1113798_nklzr6lk7z.css';
@import 'http://at.alicdn.com/t/font_1331132_5lvbai88wkb.css';
@import 'http://at.alicdn.com/t/font_1995444_i4ahvgbgeka.css';

.design-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

  .tools {
    // flex-shrink: 0;
    width: 200px;
    background-color: #f8f8f8;
    border-right: 1px solid #d9d9d9;
    overflow-y: auto;
    padding: 10px;
    .info{
      .btn{
        text-align: center;
        .button + .button{
          margin-left: 20px;
        }
      }
      .name{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #7777;
      }
      .desc{
        margin-top: 6px;
      }
    }
    .title {
      color: #0d1a26;
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      padding: 10px 2px 6px;
      margin-top: 0.08rem;
      border-bottom: 1px solid #ddd;

      &:first-child {
        border-top: none;
      }
    }

    .buttons {
    //   padding: 0.1rem 0;
      display: flex;
      flex-wrap: wrap;
      a {
        color: #314659;
        // line-height: 1;
        margin: 4px 6px;
        display: inline-block;
        text-align: center;
        // text-decoration: none !important;
        cursor: pointer;

        .iconfont {
          font-size: 16px;
        }

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .canvas {
    flex: 1;
    width: initial;
    position: relative;
    overflow: auto;
    width: 100%;
    background: #fff;
  }

  .props {
    flex-shrink: 0;
    width: 240px;
    padding: 0.1rem 0;
    background-color: #f8f8f8;
    border-left: 1px solid #d9d9d9;
    overflow-y: auto;
    position: relative;
  }

  .context-menu {
    position: fixed;
    z-index: 10;
  }
    a {
        text-decoration: none;
        color: #314659;
        &:hover {
            color: #1890ff;
        }
    }

    .text-center {
    text-align: center;
    }

    .ml5 {
    margin-left: 0.05rem;
    }

    .ml30 {
    margin-left: 0.3rem;
    }

    .ml50 {
    margin-left: 0.5rem;
    }

    .mt5 {
    margin-top: 0.05rem;
    }

    .mt10 {
    margin-top: 0.1rem;
    }

    .mr5 {
    margin-right: 0.05rem;
    }

    .ph15 {
    padding-left: 0.15rem;
    padding-right: 0.15rem;
    }

    .pv10 {
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    }

    .gray {
    color: #ccc;
    }

    .title {
    color: #0d1a26;
    font-weight: 600;
    }

    .flex {
        display: flex;

        &.column {
            flex-direction: column;
        }

        &.reverse {
            flex-direction: row-reverse;
            &.column {
            flex-direction: column-reverse;
            }
        }

        &.inline {
            display: inline-flex;
        }

        &.wrap {
            flex-wrap: wrap;
        }

        &.nowrap {
            flex-wrap: nowrap;
        }

        &.center {
            justify-content: center;
        }

        &.middle {
            align-items: center;
        }

        & > .full {
            flex-grow: 1;
            min-width: auto !important;
            width: auto !important;
        }

        &.grid > div {
            flex: 1;
        }

        label {
            flex-shrink: 0;
        }
    }

    // }
}
</style>
