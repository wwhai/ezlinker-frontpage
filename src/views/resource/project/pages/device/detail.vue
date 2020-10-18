<template>
  <d2-container class="device-detail-container">
    <el-card class="box-card">
      <el-page-header slot="header" @back="goBack" :content="pageTitle" />
      <div class="meta" v-loading="device.loading">
        <div class="info">
          <div class="item">
            <div class="label">设备序号</div>
            <div class="value">{{ device.data.sn }}</div>
          </div>
          <div class="item">
            <div class="label">设备名称</div>
            <div class="value">{{ device.data.name }}</div>
          </div>
          <div class="item">
            <div class="label">设备型号</div>
            <div class="value">{{ device.data.model }}</div>
          </div>
          <div class="item">
            <div class="label">生产厂家</div>
            <div class="value">{{ device.data.industry }}</div>
          </div>
          <div class="item">
            <div class="label">当前状态</div>
            <div class="value">
              <div v-if="device.data.state == 'ONLINE'">
                <i
                  class="fa fa-check"
                  aria-hidden="true"
                  style="margin-right: 6px"
                ></i>
              </div>
              <div v-else>
                <i
                  class="fa fa-close"
                  aria-hidden="true"
                  style="margin-right: 6px"
                ></i>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="label">创建日期</div>
            <div class="value">{{ device.data.createTime }}</div>
          </div>
          <!-- 操作面板 -->
          <div class="item">
            <div class="label">操作面板</div>
            <el-link
              type="primary"
              size="mini"
              @click="controlPannelVisible = true"
              plain
              style="height: 30px"
              >操作面板</el-link
            >
          </div>
          <el-drawer
            title="设备操作面板"
            :visible.sync="controlPannelVisible"
            :direction="'rtl'"
          >
            <el-card
              style="margin: 0px 10px 0px 10px; padding: 4px 0px 0px 0px"
            >
              <el-form label-width="100px">
                <el-form-item label="指令">
                  <span>
                    <i class="fa fa-terminal" aria-hidden="true"></i>
                    <el-input
                      type="textarea"
                      autosize
                      placeholder="请输入指令内容"
                      v-model="command"
                    >
                    </el-input>
                  </span>

                  <div style="text-align: right; padding: 4px 4px 4px 4px">
                    <el-button type="primary" @click="sendCmdToDevice"
                      >发 送</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card
              style="margin: 0px 10px 0px 10px; padding: 4px 0px 0px 0px"
            >
              其他功能尽情期待
            </el-card>
          </el-drawer>

          <!-- --------- -->
          <el-dialog
            title="发送指令"
            :visible.sync="sendCmdDialogVisible"
            width="50%"
          >
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="command"
            >
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="sendCmdToDevice"
                >发 送</el-button
              >
            </span>
          </el-dialog>
          <!-- ---- -->
          <el-dialog
            title="查看协议接入点"
            :visible.sync="entryPointsDialogVisible"
            width="50%"
          >
            <!-- --- -->
            <el-row :gutter="24">
              <el-col :span="24">
                <el-collapse>
                  <el-collapse-item
                    v-for="(e, i) in entryPoints.data"
                    :key="i"
                    :title="e.label"
                  >
                    <el-form label-position="left" label-width="150px">
                      <div v-if="e.name == 'HTTP'">
                        <el-form-item label="数据上传"
                          >http://host:port/$EZLINKER/dataPush/{{
                            device.data.clientId
                          }}</el-form-item
                        >
                        <el-form-item label="状态同步"
                          >http://host:port/$EZLINKER/syncState/{{
                            device.data.clientId
                          }}</el-form-item
                        >
                      </div>
                      <!-- --- -->
                      <div v-if="e.name == 'COAP'">
                        <el-form-item label="数据上传"
                          >coap://host:port/$EZLINKER/dataPush/{{
                            device.data.clientId
                          }}</el-form-item
                        >
                        <el-form-item label="状态同步"
                          >coap://host:port/$EZLINKER/syncState/{{
                            device.data.clientId
                          }}</el-form-item
                        >
                      </div>
                      <!-- ---- -->
                      <div v-if="e.name == 'MQTT'">
                        <el-form-item label="Username">
                          <i
                            class="el-icon-s-custom"
                            style="margin-right: 6px"
                          ></i>
                          {{ device.data.username }}
                        </el-form-item>
                        <el-form-item label="ClientId">
                          <i
                            class="el-icon-c-scale-to-original"
                            style="margin-right: 6px"
                          ></i>
                          {{ device.data.clientId }}
                        </el-form-item>
                        <el-form-item label="Password">
                          <i
                            class="el-icon-umbrella"
                            style="margin-right: 6px"
                          ></i>
                          {{ device.data.password }}
                        </el-form-item>
                        <el-form-item label="数据上传Topic">
                          <i class="el-icon-sort" style="margin-right: 6px"></i>
                          $EZLINKER/{{ device.data.clientId }}/c2s
                        </el-form-item>
                        <el-form-item label="状态同步Topic">
                          <i
                            class="el-icon-refresh"
                            style="margin-right: 6px"
                          ></i>
                          $EZLINKER/{{ device.data.clientId }}/state
                        </el-form-item>
                        <el-form-item label="订阅通道Topic">
                          <i
                            class="el-icon-share"
                            style="margin-right: 6px"
                          ></i>
                          $EZLINKER/{{ device.data.clientId }}/s2c
                        </el-form-item>
                      </div>
                      <!-- ---- -->
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="entryPointsDialogVisible = false"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </div>
    </el-card>
    <!-- 状态 -->
    <el-row :gutter="24">
      <el-col :span="24">
        <div>
          <el-card style="padding-bottom: 30px; margin-top: 2px">
            <el-col
              v-for="(item, i) in device.data.fieldParams"
              :key="i"
              :span="8"
            >
              <el-card
                shadow="never"
                style="margin-bottom: 10px; text-align: center; height: 150px"
              >
                <div>
                  <el-row>
                    <el-col :span="24">
                      <div style="color: red; text-align: left">
                        <el-link
                          type="primary"
                          v-if="item.fieldType === 'STREAM'"
                          >播放视频</el-link
                        >
                        <el-link
                          type="primary"
                          v-else
                          @click="historyState(item)"
                          >历史数据</el-link
                        >
                      </div>
                      <div
                        v-if="item.value != undefined && item.value != null"
                        style="font-size: 34px; padding-bottom: 8px"
                      >
                        {{ "[" + item.value + "]" }}
                      </div>
                      <div
                        v-else-if="
                          item.defaultValue != undefined &&
                          item.defaultValue != null
                        "
                        style="font-size: 34px; padding-bottom: 8px"
                      >
                        {{ "[" + item.defaultValue + "]" }}
                      </div>

                      <!-- //
                      // 选择UI类型,视频流，地图，图表等等
                      // -->
                      <div v-else style="font-size: 30px; padding-bottom: 8px">
                        <!-- 流媒体 -->
                        <div v-if="item.fieldType === 'STREAM'">
                          <i
                            onmouseover="this.style.color='#00BFFF'"
                            onmouseout="this.style.color='#000000'"
                            class="fa fa-play-circle-o fa-2x"
                            aria-hidden="true"
                            @click="
                              () => {
                                streamDialog.show = true;
                              }
                            "
                          ></i>
                        </div>
                        <!-- 地图 -->
                        <div v-else-if="item.fieldType === 'GEO'">
                          <i
                            class="fa fa-globe fa-2x"
                            onmouseover="this.style.color='#00BFFF'"
                            onmouseout="this.style.color='#000000'"
                            @click="
                              () => {
                                geoDialog.show = true;
                              }
                            "
                          ></i>
                        </div>
                        <!-- 布尔 -->
                        <div
                          v-else-if="item.fieldType === 'BOOLEAN'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          FALSE
                        </div>
                        <!-- 数字 -->
                        <div
                          v-else-if="item.fieldType === 'NUMBER'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        ></div>
                        <!-- 纯文本 -->
                        <div
                          v-else-if="item.fieldType === 'TEXT'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          NULL
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- 描述文本 -->
                  <el-row>
                    <el-col :span="24">
                      <div
                        style="font-size: 20px; color: #000000"
                        v-if="item.description != undefined"
                      >
                        {{ item.description }}
                      </div>
                      <!-- 默认值 -->
                      <div style="font-size: 20px; color: #000000" v-else>
                        <div
                          v-if="item.fieldType === 'NUMBER'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          数值
                        </div>
                        <div
                          v-if="item.fieldType === 'BOOLEAN'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          布尔值
                        </div>
                        <div
                          v-if="item.fieldType === 'TEXT'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          文本值
                        </div>
                        <div
                          v-if="item.fieldType === 'STREAM'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          流媒体
                        </div>
                        <div
                          v-if="item.fieldType === 'GEO'"
                          onmouseover="this.style.color='#00BFFF'"
                          onmouseout="this.style.color='#000000'"
                        >
                          地理坐标
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 曲线弹框 -->
    <el-dialog
      title="数据变化曲线"
      :visible.sync="chartDataDialog.show"
      width="60%"
    >
      <div style="width: 100%">
        <ve-line :data="chartDataDialog.chartData"></ve-line>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chartDataDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="chartDataDialog.show = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 流媒体 -->
    <el-dialog
      title="视频播放器"
      v-if="streamDialog.show"
      :visible.sync="streamDialog.show"
      width="60%"
      before-close="stopPlayVideo"
    >
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
      <span slot="footer" class="dialog-footer">
        <el-button @click="streamDialog.show = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- GEO -->
    <el-dialog
      title="地图"
      v-if="geoDialog.show"
      :visible.sync="geoDialog.show"
      width="900px"
    >
      <!-- <div id="container" style="height: 400px"></div> -->
      <el-amap class="amap-box" style="height: 400px" :vid="'amap-vue'">
        <el-amap-circle-marker
          v-for="(marker, i) in markers"
          :key="i"
          :center="marker.center"
          :radius="marker.radius"
          :fill-color="marker.fillColor"
          :fill-opacity="marker.fillOpacity"
          :events="marker.events"
        ></el-amap-circle-marker>
      </el-amap>

      <span slot="footer" class="dialog-footer">
        <el-button @click="geoDialog.show = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- ---- -->
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-top: 2px">
          <div slot="header">定时调度任务</div>
          <el-table :data="schedules.data">
            <!-- <el-table-column prop="deviceName" label="SN"></el-table-column> -->
            <el-table-column prop="jobName" label="任务名"></el-table-column>
            <el-table-column
              prop="cronExpression"
              label="Corn表达式"
            ></el-table-column>
            <el-table-column prop="description" label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status == 'STOP'" type="danger"
                  >停止</el-tag
                >
                <el-tag v-if="scope.row.status == 'PAUSE'" type="warning"
                  >暂停</el-tag
                >
                <el-tag v-if="scope.row.status == 'RUNNING'" type="success"
                  >运行</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column prop="scheduleData" label="数据">
              <template slot-scope="scope">{{
                scope.row.scheduleData
              }}</template>
            </el-table-column>
            <el-table-column prop="description" label="备注"></el-table-column>

            <el-table-column
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column prop="createTime" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="scope.row.status == 'STOP'"
                  plain
                  type="success"
                  >启动</el-button
                >
                <el-button
                  size="mini"
                  v-if="scope.row.status == 'RUNNING'"
                  plain
                  type="danger"
                  >停止</el-button
                >
                <el-button
                  size="mini"
                  v-if="scope.row.status == 'PAUSE'"
                  plain
                  type="warning"
                  >恢复</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-top: 2px">
          <div slot="header">设备数据记录</div>
          <el-table :data="deviceData.data" height="600px">
            <el-table-column
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column prop="data" label="数据记录"></el-table-column>
          </el-table>
          <div style="margin-top: 20px; text-align: right">
            <el-pagination
              backg
              layout="total, prev, pager, next"
              @current-change="deviceDataPagenation"
              :current-page.sync="deviceData.current"
              :page-size="deviceData.size"
              :total="deviceData.total"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Vue from "vue";
import VueAMap from "vue-amap";

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "8a906ce63c3405ed66c93fac6d48a021",
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PolyEditor",
    "AMap.CircleEditor",
  ],
  events: {
    init: (o) => {
      console.log(o.getCenter());
      o.getCity((result) => {
        console.log(result);
      });
    },
    moveend: () => {},
    zoomchange: () => {},
    click: (e) => {
      alert("map clicked");
    },
  },
  v: "1.4.4",
});

export default {
  name: "device-detail",
  components: {
    videoPlayer,
  },
  data() {
    return {
      pageTitle: "设备详情",
      currentDateTime: 0,
      entryPointsDialogVisible: false,
      sendCmdDialogVisible: false,
      controlPannelVisible: false,
      command: "",
      clientId: null,
      entryPoints: {
        data: [],
      },
      // 定时器列表
      timers: [],
      // 设备
      device: {
        data: {},
        loading: false,
      },
      // 模块
      modules: {
        data: [],
        loading: false,
      },
      // 模块日志
      moduleLog: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
      },
      // 历史数据
      deviceData: {
        data: [],
        current: 0,
        size: 10,
        total: 0,
      },
      //历史状态
      deviceState: {
        fields: [],
        data: [],
        current: 0,
        size: 10,
        total: 0,
      },
      // 设备日志
      deviceLog: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
      },
      // 调度任务
      schedules: {
        data: [],
        current: 1,
        size: 10,
        total: 0,
      },
      // 弹框
      numberDialog: { show: false },
      textDialog: { show: false },
      boolDialog: { show: false },
      streamDialog: { show: false },
      geoDialog: { show: false },
      markers: [
        {
          center: [121.5273285, 31.21515044],
          radius: 20,
          fillOpacity: 1,
          fillColor: "rgba(0,0,255,1)",
          events: {
            click: () => {
              alert("click");
            },
          },
        },
      ],
      // 弹出的图表
      chartDataDialog: {
        show: false,
        chartData: {
          columns: ["date", "T"],
          rows: [
            { date: "01-01", T: 1231 },
            { date: "01-02", T: 1223 },
            { date: "01-03", T: 2123 },
            { date: "01-04", T: 4123 },
            { date: "01-05", T: 3123 },
            { date: "01-06", T: 7123 },
          ],
        },
      },
      //
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src:
              "http://demo.easynvr.com:10800/flv/hls/stream_50.flv?token=xSJ4ZsCc",
          },
        ],
        poster: "https://s1.ax1x.com/2020/10/08/0Bu9Wn.md.jpg",
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
    };
  },
  created() {
    // 链接Websocket
    this.deviceId = this.$route.params.deviceId;
    this.projectId = this.$route.params.projectId;
    this.getDeviceInfo();
    this.initWebSocket();
    this.getOnlineState();
    this.getSchedules();
    this.initMap();
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  destroyed() {
    for (let index = 0; index < this.timers.length; index++) {
      clearInterval(this.timers[index]);
    }
  },
  methods: {
    //
    goBack() {
      // project-device
      this.$router.push({ name: "project-device", projectId: this.projectId });
    },
    sendCmdToDevice() {
      console.log("发送指令到:", this.device.data.clientId);
    },
    // 历史数据
    historyState() {},
    stopPlayVideo() {},
    //
    getdeviceState() {
      this.$api
        .DEVICE_STATE(
          this.device.data.clientId,
          this.deviceState.current,
          this.deviceState.size,
          this.deviceState.fields
        )
        .then((result) => {
          this.deviceState.data = result.data.records;
          this.deviceState.total = result.data.total;
          this.deviceState.pages = result.data.pages;
          this.deviceState.size = result.data.size;
        })
        .catch((err) => {});
    },
    deviceStatePagenation(current) {
      this.deviceState.current = current;
      this.getdeviceState();
    },
    // 设备的历史数据
    getDeviceData() {
      let params = {
        clientId: this.clientId,
        current: this.deviceData.current,
        size: this.deviceData.size,
      };
      this.$api
        .DEVICE_DATA(params)
        .then((res) => {
          this.deviceData.data = res.records;
          this.deviceData.total = res.total;
          this.deviceData.pages = res.pages;
          this.deviceData.size = res.size;
        })
        .catch((err) => {});
    },
    // 分页
    deviceDataPagenation(current) {
      this.deviceData.current = current;
      this.getDeviceData();
    },
    //获取设备的状态
    getOnlineState() {
      this.$api
        .DEVICE_ONLINE_STATE([this.clientId])
        .then((res) => {
          this.device.data.state = res[0].state;
        })
        .catch((err) => {});
    },
    // 获取模块列表
    getModules() {
      this.$api
        .MODULE_QUERY_FOR_PAGE({ deviceId: this.deviceId })
        .then((res) => {
          this.modules.data = res.records;
        })
        .catch((err) => {});
    },
    // 获取设备详情
    getDeviceInfo() {
      this.device.loading = true;
      this.$api
        .DEVICE_INFO(this.deviceId)
        .then((res) => {
          this.device.data = res;
          this.clientId = res.clientId;
          this.device.loading = false;
          this.getDeviceLog();
          this.getOnlineState();
          this.getDeviceData();
          this.getdeviceState();
          let id = setInterval(this.getOnlineState, 2000);
          this.timers.push(id);
        })
        .catch((err) => {
          this.device.loading = false;
        });
    },
    // 设备日志
    getDeviceLog() {
      this.$api
        .DEVICE_LOGS({ clientId: this.clientId })
        .then((res) => {
          this.deviceLog.data = res.records;
          this.deviceLog.total = res.total;
          this.deviceLog.pages = res.pages;
          this.deviceLog.size = res.size;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 调度任务
    getSchedules() {
      this.$api
        .SCHEDULE_QUERY_FOR_PAGE({ deviceId: this.deviceId })
        .then((res) => {
          this.schedules.data = res.records;
          this.schedules.total = res.total;
          this.schedules.pages = res.pages;
          this.schedules.size = res.size;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    initWebSocket() {
      this.connect();
      let id = setInterval(this.sendCmd, 2000);
      this.timers.push(id);
    },
    sendCmd() {
      let self = this;
      let fields = [];
      for (let e of self.device.data.fieldParams) {
        fields.push(e.field);
      }
      try {
        self.stompClient.send(
          "/ws2device",
          {},
          JSON.stringify({
            cmd: "DEVICE_STATE",
            clientId: self.device.data.clientId,
            fields: fields,
          })
        );
      } catch (err) {
        self.connect();
      }
    },
    // 连接
    connect() {
      this.socket = new SockJS("http://127.0.0.1:2500/ezlinker/ws");
      this.stompClient = Stomp.over(this.socket);
      let headers = {
        login: "user",
        passcode: "pwd",
      };
      let _this = this;
      this.stompClient.connect(
        headers,
        (success) => {
          _this.sendCmd();
          _this.stompClient.subscribe("/s2device", (msg) => {
            let fieldParams = _this.device.data.fieldParams;
            let states = JSON.parse(msg.body);
            for (let field of fieldParams) {
              for (let state of states) {
                if (field.field == state.field) {
                  field["value"] = state.value;
                }
              }
            }
            _this.device.data.fieldParams = [...fieldParams];
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
    },
  },
};
</script>

<style lang='scss'>
.device-detail-container {
  .box-card + .box-card {
    margin-top: 20px;
  }
  .meta {
    display: flex;
    .logo {
      width: 100px;
      height: 100px;
      padding-right: 20px;
      img {
        width: 100%;
      }
    }
    .info {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      line-height: 30px;
      .item {
        width: 25%;
        display: flex;
        .label {
          padding-right: 4px;
          font-weight: bold;
          color: #303133;
          &::after {
            content: ":";
          }
        }
        .value {
          word-break: break-all;
        }
      }
    }
  }
}
</style>