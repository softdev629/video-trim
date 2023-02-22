<template>
  <div class="setting-panel"
    :style="` width:${this.$store.state.set.settingBoxWidth}px; height:${this.$store.state.set.panelHeight}px`"
    v-if="this.$store.state.set.selectedSettingTool !== 0">
    <div class="setting-panel-close" v-if="this.$store.state.set.selectedSettingTool !== 0"><a @click="close()">
        <i class="fa fa-chevron-left"></i></a></div>
    <div v-if="this.$store.state.set.selectedSettingTool === `shape`" style="text-align:center">
      <button class="btn my-btn btn-success" style="margin-bottom:5px;width:50%" @click="addShape()">Add Shape</button>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `trim`">
      <div style="display:flex;justify-content: center;">
        <label style="width:50px;text-align: right;">From&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.videoFrom.mm" :tss="this.$store.state.set.videoFrom.ss"
          :tss1="this.$store.state.set.videoFrom.ss1" :timeData="`stimeData`" @timeChange="stimeChange" />
      </div>
      <div style="display:flex; margin-top:10px;justify-content: center;">
        <label style="width:50px;text-align: right;">To&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.videoTo.mm" :tss="this.$store.state.set.videoTo.ss"
          :tss1="this.$store.state.set.videoTo.ss1" :timeData="`etimeData`" @timeChange="etimeChange" />
      </div><!-- 
                                <div style="display:flex; margin-top:10px;justify-content: center;">
                                  <label style="width:50px;text-align: right;">Delay&nbsp;&nbsp;:</label>
                                  <Timepicker :timeData="`delay`" :tmm="this.$store.state.set.delay.mm" :tss="this.$store.state.set.delay.ss"
                                    :tss1="this.$store.state.set.delay.ss1" @timeChange="delay" />
                                </div> -->
      <div>
        <!-- <button class="btn btn-success btn-tool" @click="trim()">Save</button> -->
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `audio`">
      <div style="display:flex;justify-content: space-between;">
        <button class="btn btn-info btn-tool" style="margin-top:0px;" @click="record()"><i
            class="fa fa-microphone"></i></button>
        <label style="margin-top:5px;">{{ `${recordTime.mm}:${recordTime.ss}.${recordTime.ss1}
                  `}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
      </div>
      <div style="display:flex;justify-content: space-around;">
        <button class="btn btn-danger btn-tool btn-record" @click="recordRestart()">{{
          this.btnType }}</button>
        <button class="btn btn-primary btn-tool btn-record" @click="clear()">Clear</button>
        <button class="btn btn-success btn-tool btn-record" @click="recordAdd()">Add</button>
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `text`">
      <div class="row">
        <div class="col-md-12">
          <button class="btn my-btn btn-success" @click="addSubTitle()">Add Subtitle</button>
        </div>
        <div class="form-group" style="margin:0px;">
          <div class="col-md-12  relative-div" style="position:relative;">
            <i class="fa fa-close text-close absolute-div" style="display:none"></i>
            <textarea v-model="this.$store.state.set.textContent" @keyup="change(`textContent`)"
              class="sub-title-text absolute-div" placeholder="sub title"></textarea>
          </div>
        </div>
        <div class="form-group" style="display:flex;justify-content: space-between;">
          <div style="display:flex;">
            <Timepicker :tmm="this.$store.state.set.textFrom.mm" :tss="this.$store.state.set.textFrom.ss"
              :tss1="this.$store.state.set.textFrom.ss1" :timeData="`sttimeData`" />
          </div>
          <div>
            <input type="color" v-model="this.$store.state.set.textColor" @change="change(`textColor`)" />
          </div>
          <div style="display:flex;">
            <Timepicker :tmm="this.$store.state.set.textTo.mm" :tss="this.$store.state.set.textTo.ss"
              :tss1="this.$store.state.set.textTo.ss1" :timeData="`ettimeData`" />
          </div>
        </div>
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `shape`" style="margin-top:10px;">

      <div class="form-group">
        <div class="col-md-12">
          <div class="shape-box">
            <div class="shape-item relative-div"
              style="position:relative;background-color: rgba(15,15,15,0.5); border:solid 1px #0d6efd"
              @mouseover="showIcon($event)" @mouseout="notShowIcon($event)" @click="change1(`rectangle`, $event)"
              data-type="rectangle">
              <div class="shape-rectangle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`circle`, $event)" data-type="circle">
              <div class="shape-circle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`line`, $event)" data-type="line">

              <div class="shape-line absolute-div"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group" style="display:flex;justify-content: space-between;margin-bottom: 5px;">
        <div style="display:flex;">
          <Timepicker :tmm="this.$store.state.set.shapeFrom.mm" :tss="this.$store.state.set.shapeFrom.ss"
            :tss1="this.$store.state.set.shapeFrom.ss1" :timeData="`sstimeData`" @timeChange="sShapeTimeChange" />
        </div>
        <div>
          <input v-model="this.$store.state.set.shapeBorderColor" @change="change('shapeBorderColor')" type="color" />
        </div>
        <div style="display:flex;">
          <Timepicker :tmm="this.$store.state.set.shapeTo.mm" :tss="this.$store.state.set.shapeTo.ss"
            :tss1="this.$store.state.set.shapeTo.ss1" :timeData="`estimeData`" @timeChange="sShapeTimeChange" />
          <!-- <Timepicker :tmm="this.$store.state.set.shapeTo.mm" :tss="this.$store.state.set.shpaeTo.ss"
            :tss1="this.$store.state.set.shapeTo.ss1" :timeData="`estimeData`" @timeChange="sShapeTimeChange" /> -->
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 5px;">
        <div class="col-md-7 right">
          <label>Offset Width&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left ">
          <input v-model="this.$store.state.set.shapeOffsetWidth" @change="change(`shapeOffsetWidth`)" type="number"
            min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;" v-if="this.$store.state.set.shapeContent === `rectangle`">
        <div class="col-md-7 right">
          <label>Offset Height&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetHeight" @change="change(`shapeOffsetHeight`)" type="number"
            min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;">
        <div class="col-md-7 right">
          <label>Offset Top&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetTop" @change="change(`shapeContent`)" type="number" min="0"
            max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;">
        <div class="col-md-7 right">
          <label>Offset Left&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetLeft" @change="change(`shapeContent`)" type="number" min="0"
            max="1000" />
        </div>
      </div>

    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `cut`">
      <div style="display:flex;justify-content: center;">
        <label style="width:50px;text-align: right;">From&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.cutFrom.mm" :tss="this.$store.state.set.cutFrom.ss"
          :tss1="this.$store.state.set.cutFrom.ss1" :timeData="`sctimeData`" @timeChange="stimeChange" />
      </div>
      <div style="display:flex; margin-top:10px;justify-content: center;">
        <label style="width:50px;text-align: right;">To&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.cutTo.mm" :tss="this.$store.state.set.cutTo.ss"
          :tss1="this.$store.state.set.cutTo.ss1" :timeData="`ectimeData`" @timeChange="etimeChange" />
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router'
import setStore from "../store/modules/set.module";
import uploadStore from "../store/modules/upload.module";
import UploadModule from '../store/modules/upload.module.js'
import Timepicker from "./subToolComponents/TimePicker.vue";
import "vue3-timepicker/dist/VueTimepicker.css";
import { ref } from "vue";
import axios from 'axios';


export default {
  name: "SettingPanel",
  data() {
    return {
      width: 0,
      height: 450,
      stimeData: {
        mm: "00",
        ss: "00",
        ss1: "00",
      },
      etimeData: {
        mm: "00",
        ss: "12",
        ss1: "77",
      },
      audioFrom: { mm: "00", ss: "00", ss1: "00" },
      audioTo: { mm: "00", ss: "00", ss1: "00" },
      recordTime: { mm: 0, ss: 0, ss1: 0 },
      recordMTime: 0,
      polling: null,
      btnType: 'Pause',
      shapeColor: "rgb(16,16,16)",
      shapeOffsetWidth: 100,
      shapeOffsetHeight: 60,
      shapeOffsetTop: 20,
      shapeOffsetLeft: 20,
      shapeFrom: { mm: "00", ss: "00", ss1: "00" },
      shapeTo: { mm: "00", ss: "00", ss1: "00" },
      textContent: "",
      textBorderColor: "rgb(16,16,16)",
      textOffsetWidth: 350,
      textOffsetHeight: 80,
      textOffsetTop: 100,
      textOffsetLeft: 1000,
      textFrom: { mm: "00", ss: "00", ss1: "00" },
      textTo: { mm: "00", ss: "00", ss1: "00" },
    };
  },
  components: {
    Timepicker,
  },
  mounted() {
    const store = useStore();
    this.width = setStore.state.settingBoxWidth;
    this.height = setStore.state.screenHeight;
    if (!setStore.state.selectedSettingTool)
      this.panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + setStore.state.settingBoxWidth + 1);
    else
      this.panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + setStore.state.settingBoxWidth + 40 + 1);

    if (this.height / this.panelWidth < setStore.state.screenRate) {
      this.panelHeight = setStore.state.screenHeight;
    }
    else {
      this.panelHeight = this.panelWidth * setStore.state.screenRate;
    }

    this.stimeData.mm = this.$store.state.set.videoFrom.mm;
    this.stimeData.ss = this.$store.state.set.videoFrom.ss;
    this.stimeData.ss1 = this.$store.state.set.videoFrom.ss1;

    this.etimeData.mm = this.$store.state.set.videoTo.mm;
    this.etimeData.ss = this.$store.state.set.videoTo.ss;
    this.etimeData.ss1 = this.$store.state.set.videoTo.ss1;


    this.textOffsetLeft = 300 + this.$store.state.set.toolSideBar + 5 + (this.panelWidth - this.$store.state.set.screenWidth) / 2;

    var payload = { type: "textOffsetLeft", value: this.textOffsetLeft };
    this.$store.dispatch("setData", payload);

    payload = { type: "textFrom", value: { mm: 0, ss: 0, ss1: 0 } };
    this.$store.dispatch("setData", payload);

    payload = { type: "textTo", value: { mm: 0, ss: 5, ss1: 0 } };
    this.$store.dispatch("setData", payload);

    payload = { type: "shapeFrom", value: { mm: 0, ss: 0, ss1: 0 } };
    this.$store.dispatch("setData", payload);

    payload = { type: "shapeTo", value: { mm: 0, ss: 5, ss1: 0 } };
    this.$store.dispatch("setData", payload);

  },
  setup() {
    const router = useRouter();
    const route = useRoute();
  },
  methods: {
    record: function () {
      window.clearInterval(this.polling);
      this.polling = window.setInterval(() => {
        this.recordMTime++;
        this.recordTime.mm = parseInt(this.recordMTime / 6000);
        this.recordTime.ss = parseInt((this.recordMTime % 6000) / 100);
        this.recordTime.ss1 = parseInt((this.recordMTime % 6000) % 100);
      }, 10);
    },
    recordRestart: function () {
      if (this.btnType === "Pause") {
        this.btnType = "Restart";
        window.clearInterval(this.polling);
      }
      else if (this.btnType === "Restart") {
        window.clearInterval(this.polling);
        this.btnType = "Pause";
        this.recordTime.mm = 0;
        this.recordTime.ss = 0;
        this.recordTime.ss1 = 0;
        this.recordMTime = 0;
        this.record();
      }
    },
    clear: function () {
      this.btnType = "Pause";
      window.clearInterval(this.polling);
      this.recordTime.mm = 0;
      this.recordTime.ss = 0;
      this.recordTime.ss1 = 0;
      this.recordMTime = 0;
    },
    recordAdd: function () {
      if (this.recordMTime) {
        alert('Adding is success.');
      }
      else {
        alert('Nothing is data to add.');
      }
      window.clearInterval(this.polling);
      this.recordTime.mm = 0;
      this.recordTime.ss = 0;
      this.recordTime.ss1 = 0;
      this.recordMTime = 0;
      this.btnType = "Pause";

      return;
    },
    close: function () {

      for (var i = 0; i < 5; i++) {
        document.getElementsByClassName('sub-tool-component')[i].className = "panel-group sub-tool-component";
      }


      var panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 1);

      var panelHeight;
      if (this.$store.state.set.screenHeight / panelWidth < this.$store.state.set.screenRate) {
        panelHeight = this.$store.state.set.screenHeight;
      }
      else {
        panelHeight = panelWidth * this.$store.state.set.screenRate;
      }
      var payload = { type: "panelHeight", value: panelHeight };
      this.$store.dispatch("setData", payload);

      payload = { type: "panelWidth", value: panelWidth };
      this.$store.dispatch("setData", payload);

      payload = { type: "settingBoxWidth", value: 0 };
      this.$store.dispatch("setData", payload);

      payload = { type: "screenYControllerWidth", value: 0 };
      this.$store.dispatch("setData", payload);

      payload = { type: "selectedSettingTool", value: 0 };
      this.$store.dispatch("setData", payload);
    },
    trim: function () {
      var length = parseInt(this.$store.state.set.videoTo.mm) * 60 + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm) * 60 - parseInt(this.$store.state.set.videoFrom.ss);
      var start = "00:" + this.$store.state.set.videoFrom.mm.toString() + ":" + this.$store.state.set.videoFrom.ss.toString();
      var end = "00:" + this.$store.state.set.videoTo.mm.toString() + ":" + this.$store.state.set.videoTo.ss.toString();
      var newStart = "00:" + this.$store.state.set.delay.mm.toString() + ":" + this.$store.state.set.delay.ss.toString();
      //      var newEnd = "00:" + (parseInt(this.$store.state.set.videoTo.mm) + parseInt(this.$store.state.set.delay.mm)).toString() + ":" + (parseInt(this.$store.state.set.videoTo.ss) + parseInt(this.$store.state.set.delay.ss)).toString();
      var newEnd = "00:" + parseInt((parseInt(this.$store.state.set.videoTo.mm * 60) + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm * 60) - parseInt(this.$store.state.set.videoFrom.ss)) / 60).toString() + ":" + parseInt((parseInt(this.$store.state.set.videoTo.mm * 60) + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm * 60) - parseInt(this.$store.state.set.videoFrom.ss)) % 60).toString();


      var data = {
        "length": length,
        "trim": {
          "start": start,
          "end": end,
          "new_start": newStart,
          "new_end": newEnd
        }
      };

      var data1;
      data1 = { type: 'loader', value: "loader" };
      this.$store.dispatch('setData', data1);

      data1 = { type: 'all', value: "none" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "comment", value: "loading-text" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "commentDisplay", value: "block" };
      this.$store.dispatch('setData', data1);



      console.log(data.length, "data.length");
      console.log(data.trim.start, "data.start");
      console.log(data.trim.end, "data.end");
      console.log(data.trim.new_start, "data.new_start");
      console.log(data.trim.new_end, "data.new_end");

      var fname = this.$store.state.set.fileName;
      axios.post('/api/save/' + fname, data).then(ret => {


        console.log(ret.data.filename);
        var payload = { type: "fileName", value: ret.data.filename };
        this.$store.dispatch("setData", payload);
        console.log(payload);

        payload = { type: "fileCount", value: ret.data.filecount };
        this.$store.dispatch("setData", payload);
        var duration = Number(ret.data.duration) * 100;

        payload = {
          type: "duration", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoTo", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "cutTo", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "cutFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "delay", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "to", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };
        this.$store.dispatch("setData", payload);
        payload = {
          type: "curTime", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);


        payload = {
          type: "from", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);


        payload = { type: 'comment', value: "none" };
        this.$store.dispatch('setData', payload);


        payload = { type: 'loader', value: "none" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'all', value: "block" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'commentDisplay', value: "none" };
        this.$store.dispatch('setData', payload);



        this.$router.push('/workplace');
      }).catch(function () {
        console.log('FAILURE!!');
      });
    },
    audioUpload: function () {

    },
    change1: function (content, e) {
      var payload = { type: 'shapeContent', value: content };
      this.$store.dispatch('setData', payload);

      for (var i = 0; i < document.getElementsByClassName("relative-div").length; i++) {
        document.getElementsByClassName("relative-div")[i].style.backgroundColor = 'rgb(48,48,48)';
        document.getElementsByClassName("relative-div")[i].style.border = 'solid 1px rgb(48, 48, 48)';
      }


      if (e.target.className.search('relative-div') >= 0) {
        e.target.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
        e.target.style.border = "solid 1px #0d6efd";
      }
      else if (e.target.className.search('absolute-div') >= 0) {
        e.target.parentNode.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
        e.target.parentNode.style.border = "solid 1px #0d6efd";
      }
    },
    change: function (content, e) {
      var payload = { type: 'shapeContent', value: content };
      this.$store.dispatch('setData', payload);
    },
    shapeContent() {

      var payload;

      payload = { type: "shapeContent", value: this.shapeContent };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeColor", value: this.shapeColor };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeBorderColor", value: this.shapeBorderColor };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeBorderWidth", value: this.shapeBorderWidth };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeOffsetWidth", value: this.shapeOffsetWidth };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeOffsetHeight", value: this.shapeOffsetHeight };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeOffsetTop", value: this.shapeOffsetTop };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeOffsetLeft", value: this.shapeOffsetLeft };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeFrom", value: this.shapeFrom };
      this.$store.dispatch("setData", payload);

      payload = { type: "shapeTo", value: this.shapeTo };
      this.$store.dispatch("setData", payload);

      this.shapeContent = "";
      this.shapeColor = "#FFFFFF";
      this.shapeBorderColor = "rgb(16,16,16)";
      this.shapeBorderWidth = 1;
      this.shapeOffsetWidth = 350;
      this.shapeOffsetHeight = 80;
      this.shapeOffsetTop = 250;
      this.shapeOffsetLeft = 650;

      this.shapeFrom = { mm: "00", ss: "00", ss1: "00" };
      this.shapeTo = { mm: "00", ss: "00", ss1: "00" };

      alert("Commit is success.");
    },
    stimeChange: function (mm, ss, ss1) {
      var payload = { type: "videoFrom", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

      payload = { type: "cutFrom", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

    },
    etimeChange: function (mm, ss, ss1) {
      var payload = { type: "videoTo", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

      payload = { type: "cutTo", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

    },
    delay: function (mm, ss, ss1) {
      // var payload = { type: "delay", value: { mm: mm, ss: ss, ss1: ss1 } };
      // this.$store.dispatch("setData", payload);

    },
    sTextTimeChange: function () {

    },
    eTextTimeChange: function () {

    },
    sShapeTimeChange: function () {

    },
    eShapeTimeChange: function () {

    },
    showIcon: function (e) {



    },
    notShowIcon: function (e) {


    },
    addShape: function () {
      // console.log(this.$store.state.set.shapeFrom, 'this.$store.state.set.shapeFrom');
      // console.log(this.$store.state.set.shapeTo, 'this.$store.state.set.shapeTo');
      // console.log(this.$store.state.set.shapeContent, 'this.$store.state.set.shapeContent');
      // console.log(this.$store.state.set.shapeBorderColor, 'this.$store.state.set.shapeBorderColor');
      // console.log(this.$store.state.set.shapeBorderWidth, 'this.$store.state.set.shapeBorderWidth');
      // console.log(this.$store.state.set.shapeColor, 'this.$store.state.set.shapeColor');
      // console.log(this.$store.state.set.shapeOffsetWidth, 'this.$store.state.set.shapeOffsetWidth');
      // console.log(this.$store.state.set.shapeOffsetHeight, 'this.$store.state.set.shapeOffsetHeight');
      // console.log(this.$store.state.set.shapeOffsetTop, 'this.$store.state.set.shapeOffsetTop');
      // console.log(this.$store.state.set.shapeOffsetLeft - this.$store.state.set.toolSideBar - this.$store.state.set.settingBoxWidth - 45 - (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2, 'this.$store.state.set.shapeOffsetLeft');

      //from >= to 0,0  available slot return;
      if (this.$store.state.set.shapeFrom.mm * 6000 + this.$store.state.set.shapeFrom.ss * 100 + this.$store.state.set.shapeFrom.ss1 >= this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1) {

        this.$store.dispatch("setData", {
          type: "shapeFrom",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        this.$store.dispatch("setData", {
          type: "shapeTo",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });


        alert("End time couldn't equal to or less than Start time.");
        return;
      }

      //to > maxtime max, max return;
      if (this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1 > this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1) {

        this.$store.dispatch("setData", {
          type: "shapeFrom",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        this.$store.dispatch("setData", {
          type: "shapeTo",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        alert("End time couldn't larger than Video duration.");
        return;
      }

      //from<= to>= from search 0,0
      for (var i = 0; i < this.$store.state.upload.shapes.length; i++) {
        var tStart = this.$store.state.upload.shapes[i].value.shapeFrom.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeFrom.ss * 100 + this.$store.state.upload.shapes[i].value.shapeFrom.ss1;

        var tEnd = this.$store.state.upload.shapes[i].value.shapeTo.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeTo.ss * 100 + this.$store.state.upload.shapes[i].value.shapeTo.ss1;

        var t_start = this.$store.state.set.shapeFrom.mm * 6000 + this.$store.state.set.shapeFrom.ss * 100 + this.$store.state.set.shapeFrom.ss1;

        var t_end = this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1;

        if (tStart >= t_start && tStart <= t_end) {
          this.$store.dispatch("setData", {
            type: "shapeFrom",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          this.$store.dispatch("setData", {
            type: "shapeTo",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          alert("Time slot is conflicted");
          return;
        }

        if (tEnd >= t_start && tEnd <= t_end) {
          this.$store.dispatch("setData", {
            type: "shapeFrom",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          this.$store.dispatch("setData", {
            type: "shapeTo",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          alert("Time slot is conflicted");
          return;
        }

      }


      var payload = {
        type: "shapes",
        value: {
          shapeFrom: { ...this.$store.state.set.shapeFrom },
          shapeTo: { ...this.$store.state.set.shapeTo },
          shapeContent: this.$store.state.set.shapeContent,
          shapeBorderColor: this.$store.state.set.shapeBorderColor,
          shapeBorderWidth: this.$store.state.set.shapeBorderWidth,
          shapeColor: this.$store.state.set.shapeColor,
          shapeOffsetWidth: this.$store.state.set.shapeOffsetWidth,
          shapeOffsetHeight: this.$store.state.set.shapeOffsetHeight,
          shapeOffsetTop: this.$store.state.set.shapeOffsetTop,
          shapeOffsetLeft: this.$store.state.set.shapeOffsetLeft - this.$store.state.set.toolSideBar - this.$store.state.set.settingBoxWidth - 45 - (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2
        }
      }



      var maxTime = this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1;

      var tFrom = this.$store.state.set.shapeFrom.mm * 6000 + this.$store.state.set.shapeFrom.ss * 100 + this.$store.state.set.shapeFrom.ss1;
      var tTo = this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1;
      var flag = 0;

      if (tFrom >= maxTime) {
        alert("You can't add any more. The start time of subtile is exceed video duration");
        return;
      }

      if (tTo > maxTime) {
        var flag = 1;
        tTo = maxTime;
        payload.value.shapeTo.mm = this.$store.state.set.duration.mm;
        payload.value.shapeTo.ss = this.$store.state.set.duration.ss;
        payload.value.shapeTo.ss1 = this.$store.state.set.duration.ss1;
      }


      console.log(payload, 'payload to add in shapes');

      //changeState
      var changeState = this.$store.state.set.changeState + 1;

      this.$store.dispatch("setData", {
        type: "changeState",
        value: changeState
      });

      this.$store.dispatch("addToUploadDatas", payload);




      var shapeFrom = this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1 + 1;
      var shapeTo = this.$store.state.set.shapeTo.mm * 6000 + this.$store.state.set.shapeTo.ss * 100 + this.$store.state.set.shapeTo.ss1 + 500;


      if (flag == 1) {
        this.$store.dispatch("setData", {
          type: "shapeFrom",
          value: {
            mm: parseInt(shapeFrom / 6000),
            ss: parseInt((shapeFrom % 6000) / 100),
            ss1: parseInt((shapeFrom % 6000) % 100)
          }
        });

        this.$store.dispatch("setData", {
          type: "shapeTo",
          value: {
            mm: this.$store.state.set.duration.mm,
            ss: this.$store.state.set.duration.ss,
            ss1: this.$store.state.set.duration.ss1
          }
        });
      }
      else {

        this.$store.dispatch("setData", {
          type: "shapeFrom",
          value: {
            mm: parseInt(shapeFrom / 6000),
            ss: parseInt((shapeFrom % 6000) / 100),
            ss1: parseInt((shapeFrom % 6000) % 100)
          }
        });

        this.$store.dispatch("setData", {
          type: "shapeTo",
          value: {
            mm: parseInt(shapeTo / 6000),
            ss: parseInt((shapeTo % 6000) / 100),
            ss1: parseInt((shapeTo % 6000) % 100)
          }
        });

        if (shapeTo > maxTime) {
          this.$store.dispatch("setData", {
            type: "shapeTo",
            value: {
              mm: this.$store.state.set.duration.mm,
              ss: this.$store.state.set.duration.ss,
              ss1: this.$store.state.set.duration.ss1
            }
          });
        }

        if (shapeFrom > maxTime) {
          this.$store.dispatch("setData", {
            type: "shapeFrom",
            value: {
              mm: this.$store.state.set.duration.mm,
              ss: this.$store.state.set.duration.ss,
              ss1: this.$store.state.set.duration.ss1
            }
          });
        }

      }

    },
    addSubTitle: function () {
      // console.log(this.$store.state.set.textFrom, 'this.$store.state.set.textFrom');
      // console.log(this.$store.state.set.textTo, 'this.$store.state.set.textTo');
      // console.log(this.$store.state.set.textContent, 'this.$store.state.set.textContent');
      // console.log(this.$store.state.set.textColor, 'this.$store.state.set.textColor');
      // console.log(this.$store.state.set.textOffsetWidth, 'this.$store.state.set.textOffsetWidth');
      // console.log(this.$store.state.set.textOffsetHeight, 'this.$store.state.set.textOffsetHeight');
      // console.log(this.$store.state.set.textOffsetTop, 'this.$store.state.set.textOffsetTop');
      // console.log(this.$store.state.set.textOffsetLeft - this.$store.state.set.toolSideBar - this.$store.state.set.settingBoxWidth - 45 - (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2, 'this.$store.state.set.textOffsetLeft');

      //from >= to 0,0  available slot return;
      if (this.$store.state.set.textFrom.mm * 6000 + this.$store.state.set.textFrom.ss * 100 + this.$store.state.set.textFrom.ss1 >= this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1) {

        this.$store.dispatch("setData", {
          type: "textFrom",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        this.$store.dispatch("setData", {
          type: "textTo",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });


        alert("End time couldn't equal to or less than Start time.");
        return;
      }

      //to > maxtime max, max return;
      if (this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1 > this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1) {

        this.$store.dispatch("setData", {
          type: "textFrom",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        this.$store.dispatch("setData", {
          type: "textTo",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });

        alert("End time couldn't larger than Video duration.");
        return;
      }

      //from<= to>= from search 0,0
      for (var i = 0; i < this.$store.state.upload.texts.length; i++) {
        var tStart = this.$store.state.upload.texts[i].value.textFrom.mm * 6000 + this.$store.state.upload.texts[i].value.textFrom.ss * 100 + this.$store.state.upload.texts[i].value.textFrom.ss1;

        var tEnd = this.$store.state.upload.texts[i].value.textTo.mm * 6000 + this.$store.state.upload.texts[i].value.textTo.ss * 100 + this.$store.state.upload.texts[i].value.textTo.ss1;

        var t_start = this.$store.state.set.textFrom.mm * 6000 + this.$store.state.set.textFrom.ss * 100 + this.$store.state.set.textFrom.ss1;

        var t_end = this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1;

        if (tStart >= t_start && tStart <= t_end) {
          this.$store.dispatch("setData", {
            type: "textFrom",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          this.$store.dispatch("setData", {
            type: "textTo",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          alert("Time slot is conflicted");
          return;
        }

        if (tEnd >= t_start && tEnd <= t_end) {
          this.$store.dispatch("setData", {
            type: "textFrom",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          this.$store.dispatch("setData", {
            type: "textTo",
            value: {
              mm: 0,
              ss: 0,
              ss1: 0
            }
          });

          alert("Time slot is conflicted");
          return;
        }

      }


      var payload = {
        type: "texts",
        value: {
          textFrom: { ...this.$store.state.set.textFrom },
          textTo: { ...this.$store.state.set.textTo },
          textContent: this.$store.state.set.textContent,
          textColor: this.$store.state.set.textColor,
          textOffsetWidth: this.$store.state.set.textOffsetWidth,
          textOffsetHeight: this.$store.state.set.textOffsetHeight,
          textOffsetTop: this.$store.state.set.textOffsetTop,
          textOffsetLeft: this.$store.state.set.textOffsetLeft - this.$store.state.set.toolSideBar - this.$store.state.set.settingBoxWidth - 45 - (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2
        }
      }


      /*  check time slot to add if user changes manually textfrom and textto value  */
      var maxTime = this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1;

      var tFrom = this.$store.state.set.textFrom.mm * 6000 + this.$store.state.set.textFrom.ss * 100 + this.$store.state.set.textFrom.ss1;
      var tTo = this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1;
      var flag = 0;

      if (tFrom >= maxTime) {
        alert("You can't add any more. The start time of subtile is exceed video duration");
        return;
      }

      if (tTo > maxTime) {
        var flag = 1;
        tTo = maxTime;
        payload.value.textTo.mm = this.$store.state.set.duration.mm;
        payload.value.textTo.ss = this.$store.state.set.duration.ss;
        payload.value.textTo.ss1 = this.$store.state.set.duration.ss1;
      }


      // console.log(payload, 'payload to add in texts');

      this.$store.dispatch("addToUploadDatas", payload);
      //changeState
      var changeState = this.$store.state.set.changeState + 1;
      this.$store.dispatch("setData", {
        type: "changeState",
        value: changeState
      });
      /*-------------------------    add success     -----------------------------*/



      var textFrom = this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1 + 1;
      var textTo = this.$store.state.set.textTo.mm * 6000 + this.$store.state.set.textTo.ss * 100 + this.$store.state.set.textTo.ss1 + 500;


      if (flag == 1) {
        this.$store.dispatch("setData", {
          type: "textFrom",
          value: {
            mm: parseInt(textFrom / 6000),
            ss: parseInt((textFrom % 6000) / 100),
            ss1: parseInt((textFrom % 6000) % 100)
          }
        });

        this.$store.dispatch("setData", {
          type: "textTo",
          value: {
            mm: this.$store.state.set.duration.mm,
            ss: this.$store.state.set.duration.ss,
            ss1: this.$store.state.set.duration.ss1
          }
        });
      }
      else {

        this.$store.dispatch("setData", {
          type: "textFrom",
          value: {
            mm: parseInt(textFrom / 6000),
            ss: parseInt((textFrom % 6000) / 100),
            ss1: parseInt((textFrom % 6000) % 100)
          }
        });

        this.$store.dispatch("setData", {
          type: "textTo",
          value: {
            mm: parseInt(textTo / 6000),
            ss: parseInt((textTo % 6000) / 100),
            ss1: parseInt((textTo % 6000) % 100)
          }
        });

        if (textTo > maxTime) {
          this.$store.dispatch("setData", {
            type: "textTo",
            value: {
              mm: this.$store.state.set.duration.mm,
              ss: this.$store.state.set.duration.ss,
              ss1: this.$store.state.set.duration.ss1
            }
          });
        }

        if (textFrom > maxTime) {
          this.$store.dispatch("setData", {
            type: "textFrom",
            value: {
              mm: this.$store.state.set.duration.mm,
              ss: this.$store.state.set.duration.ss,
              ss1: this.$store.state.set.duration.ss1
            }
          });
        }

      }

    },

  }
}
</script>

<style scoped>
.fa-chevron-left:hover {
  color: #FFFFFF;
}

textarea {
  resize: none;

}

.sub-title-text {
  width: 100%;
  margin-top: 10px;
}

.shape-box {
  display: flex;
  justify-content: space-around;
}

.shape-item {
  width: 50px;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  background-color: rgb(48, 48, 48);
}

.shape-rectangle {
  width: 40px;
  height: 40px;
  background-color: #FFFFFF;
  margin: 5px;
}

.shape-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFFFFF;
  margin: 5px;
}

.shape-line {
  width: 40px;
  height: 6px;
  background-color: #FFFFFF;
  margin: 5px;
  margin-top: 20px;
}

.my-btn {
  background-color: rgb(13, 110, 253);
  width: 100%;
}

.text-close {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 15px;
  color: #FFFFFF;
}

.fa-check {
  position: absolute;
  right: -5px;
  top: -10px;
  width: 15px;
  color: rgb(13, 110, 253);
}


/* input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
} */

.active {
  background-color: rgba(15, 15, 15, 0.5);
}

.btn-record {
  margin: 5px;
  margin-top: 20px;
}

textarea {
  color: black;
}
</style>