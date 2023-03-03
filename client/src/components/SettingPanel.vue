<template>
  <div class="setting-panel" :style="` width:100%; height:${this.$store.state.set.panelHeight}px`"
    v-if="this.$store.state.set.selectedSettingTool !== 0">
    <div class="setting-panel-close" v-if="this.$store.state.set.selectedSettingTool !== 0"><a @click="close()">
        <i class="fa fa-chevron-left"></i></a></div>
    <div v-if="this.$store.state.set.selectedSettingTool === `shape`" style="text-align:center">
      <button class="btn my-btn btn-success" style="margin-bottom:5px;width:50%" @click="addShape()">図形追加</button>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `trim`">
      <div style="display:flex;justify-content: center;">
        <label style="width:50px;text-align: right;">開始&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.videoFrom.mm" :tss="this.$store.state.set.videoFrom.ss"
          :tss1="this.$store.state.set.videoFrom.ss1" :timeData="`stimeData`" @timeChange="stimeChange" />
      </div>
      <div style="display:flex; margin-top:10px;justify-content: center;">
        <label style="width:50px;text-align: right;">終了&nbsp;&nbsp;:</label>
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
      <div class="audio-panel">
        <div style="display:flex;justify-content: space-around;">
          <button class="btn btn-info btn-tool" style="margin-top:0px;" ref="record" @click="record()"><i
              class="fa fa-microphone"></i></button>
          <label style="margin-top:5px;">{{ `${recordTime.mm}:${recordTime.ss}.${recordTime.ss1}
                      `}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="record-btn-group">
          <button class="btn btn-danger btn-tool btn-record" style="display:none" ref="stop" @click="stop()"><i
              class="fa fa-stop"></i></button>
          <button class="btn btn-primary btn-tool btn-record" ref="play" @click="play()"><i
              class="fa fa-play"></i></button>
          <button class="btn btn-success btn-tool btn-record" ref="save" @click="save()"><i
              class="fa fa-save"></i></button>
        </div>
        <div id="saved-audio-messages" ref="savedAudioMessagesContainer">
          <div class="audio-div" v-for="(audioItem, index) in this.audioList" :key="index"
            @click="audio_select($event, index)" :class="`${audioItem.active}`">
            <input v-if="audioItem.active === `audio-active`" type="radio" name="audio-group" checked />
            <input v-if="audioItem.active !== `audio-active`" type="radio" name="audio-group" />
            <audio v-if="audioItem.active === `audio-active`" :src="`/audios/${audioItem.fileName}`" controls
              class="my-audio" ref="myAudio"></audio>
            <audio v-if="audioItem.active !== `audio-active`" :src="`/audios/${audioItem.fileName}`" controls
              class="my-audio"></audio>
          </div>
        </div>
        <div>
          <button class="btn my-btn btn-success add-audio" @click="addAudio()">音声追加</button>
        </div>

      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `text`">
      <div class="row" style="padding-left: 20px; padding-right: 20px;">
        <div class="col-md-12">
          <button class="btn my-btn btn-success" @click="addSubTitle()">字幕追加</button>
        </div>
        <div class="form-group" style="margin:0px;">
          <div class="col-md-12  relative-div" style="position:relative;">
            <i class="fa fa-close text-close absolute-div" style="display:none"></i>
            <textarea v-model="this.$store.state.set.textContent" class="sub-title-text absolute-div"
              placeholder="ここに入力"></textarea>
          </div>
        </div>
        <div class="form-group" style="display:flex;justify-content: space-between;">
          <div style="display:flex;">
            <Timepicker :tmm="this.$store.state.set.textFrom.mm" :tss="this.$store.state.set.textFrom.ss"
              :tss1="this.$store.state.set.textFrom.ss1" :timeData="`sttimeData`" />
          </div>
          <div style="display:none;">
            <input type="color" v-model="this.$store.state.set.textColor" />
          </div>
          <div style="display:flex;">
            <Timepicker :tmm="this.$store.state.set.textTo.mm" :tss="this.$store.state.set.textTo.ss"
              :tss1="this.$store.state.set.textTo.ss1" :timeData="`ettimeData`" />
          </div>
        </div>
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `shape`" style="margin-top:10px;">

      <div class="form-group shape-block">
        <div class="col-md-12">
          <div class="shape-box">
            <div class="shape-item relative-div"
              style="position:relative;background-color: rgba(15,15,15,0.5); border:solid 1px #0d6efd"
              @mouseover="showIcon($event)" @mouseout="notShowIcon($event)" @click="change1(`Rectangle`, $event)"
              data-type="Rectangle">
              <div class="shape-rectangle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`Circle`, $event)" data-type="Circle">
              <div class="shape-circle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`LineToDown`, $event)" data-type="LineToDown">

              <div class="shape-line-down absolute-div"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="from-group shape-block">
        <div class="col-md-12">
          <div class="shape-box">
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`LineToUp`, $event)" data-type="LineToUp">

              <div class="shape-line-up absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`Vertical`, $event)" data-type="Vertical">

              <div class="shape-vertical absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change1(`Horizontal`, $event)" data-type="Horizontal">

              <div class="shape-horizontal absolute-div"></div>
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
          <input v-model="this.$store.state.set.shapeBorderColor" type="color" />
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
          <label>幅&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left ">
          <input v-model="this.$store.state.set.shapeOffsetWidth" type="number" min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;" v-if="this.$store.state.set.shapeContent === `Rectangle`">
        <div class="col-md-7 right">
          <label>高さ&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetHeight" type="number" min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;">
        <div class="col-md-7 right">
          <label>トップ&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetTop" type="number" min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: 5px;">
        <div class="col-md-7 right">
          <label>左オフセット&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetLeft" type="number" min="0" max="1000" />
        </div>
      </div>

    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `cut`">
      <div style="display:flex;justify-content: center;">
        <label style="width:50px;text-align: right;">開始&nbsp;&nbsp;:</label>
        <Timepicker :tmm="this.$store.state.set.cutFrom.mm" :tss="this.$store.state.set.cutFrom.ss"
          :tss1="this.$store.state.set.cutFrom.ss1" :timeData="`sctimeData`" @timeChange="stimeChange" />
      </div>
      <div style="display:flex; margin-top:10px;justify-content: center;">
        <label style="width:50px;text-align: right;">終了&nbsp;&nbsp;:</label>
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
      polling: null,
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

      recorder: null,
      audio: null,
      audioList: [],
      playOrPause: false,

      btnType: 'Pause',
      shapeColor: "rgb(16,16,16)",
      shapeOffsetWidth: 100,
      shapeOffsetHeight: 60,
      shapeOffsetTop: 20,
      shapeOffsetLeft: 20,
      shapeFrom: { mm: 0, ss: 0, ss1: 0 },
      shapeTo: { mm: 0, ss: 0, ss1: 0 },
      textContent: "",
      textBorderColor: "rgb(16,16,16)",
      textOffsetWidth: 350,
      textOffsetHeight: 80,
      textOffsetTop: 100,
      textOffsetLeft: 1000,
      textFrom: { mm: 0, ss: 0, ss1: 0 },
      textTo: { mm: 0, ss: 0, ss1: 0 },
    };
  },
  components: {
    Timepicker,
  },
  mounted() {
    const store = useStore();
    this.width = this.$store.state.set.settingBoxWidth;
    this.height = this.$store.state.set.screenHeight;
    if (!this.$store.state.set.selectedSettingTool)
      this.panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + this.$store.state.set.settingBoxWidth + 1);
    else
      this.panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + this.$store.state.set.settingBoxWidth + 40 + 1);

    if (this.height / this.panelWidth < this.$store.state.set.screenRate) {
      this.panelHeight = this.$store.state.set.screenHeight;
    }
    else {
      this.panelHeight = this.panelWidth * this.$store.state.set.screenRate;
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
  watch: {
    "$store.state.upload.audios.length": function (val, oldVal) {

      //      console.log("----------------length:---------------", this.$store.state.upload.audios.length);
      if (!this.$store.state.upload.audios.length) {
        this.audioList = [];
      }

    },
    "$store.state.set.selectedSettingTool": function (val, oldVal) {

      //      console.log("----------------length:---------------", this.$store.state.upload.audios.length);
      if (!this.$store.state.set.selectedSettingTool === "audio") {
        this.$refs.stop.setAttribute('disabled', true);
      }

    },
  },
  methods: {
    record: async function () {
      this.recordMTime = 0;

      this.playOrPause = false;
      this.$refs.play.style.display = "none";
      this.$refs.stop.style.display = "block";


      if (this.polling)
        window.clearInterval(this.polling);

      this.polling = window.setInterval(() => {
        this.recordMTime++;
        this.recordTime.mm = parseInt(this.recordMTime / 6000);
        this.recordTime.ss = parseInt((this.recordMTime % 6000) / 100);
        this.recordTime.ss1 = parseInt((this.recordMTime % 6000) % 100);
      }, 10);


      const recordAudio = () =>
        new Promise(async resolve => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          let audioChunks = [];

          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          const start = () => {
            audioChunks = [];
            mediaRecorder.start();
          };

          const stop = () =>
            new Promise(resolve => {
              mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const play = () => audio.play();
                resolve({ audioChunks, audioBlob, audioUrl, play });
              });

              mediaRecorder.stop();
            });

          resolve({ start, stop });
        });


      this.$refs.record.setAttribute('disabled', true);
      this.$refs.stop.removeAttribute('disabled');
      //      this.$refs.play.setAttribute('disabled', true);
      this.$refs.save.setAttribute('disabled', true);

      if (!this.recorder) {
        //        this.recorder = await this.$store.dispatch("recordAudio");
        this.recorder = await recordAudio();
      }
      this.recorder.start();

    },
    stop: async function () {
      if (this.polling)
        window.clearInterval(this.polling);

      this.playOrPause = true;
      this.$refs.play.style.display = "block";
      this.$refs.stop.style.display = "none";


      this.$refs.record.removeAttribute('disabled');
      this.$refs.stop.setAttribute('disabled', true);
      //      this.$refs.play.removeAttribute('disabled');
      this.$refs.save.removeAttribute('disabled');

      console.log(this.recorder);

      this.audio = await this.recorder.stop();

    },
    play: async function () {
      if (this.polling)
        window.clearInterval(this.polling);

      this.playOrPause = false;
      this.$refs.play.style.display = "none";
      this.$refs.stop.style.display = "block";

      this.audio.play();
    },
    save: async function () {
      if (this.polling)
        window.clearInterval(this.polling);


      if (!this.recordMTime)
        return;


      this.playOrPause = false;
      this.$refs.play.style.display = "none";
      this.$refs.stop.style.display = "block";

      const reader = new FileReader();



      reader.readAsDataURL(this.audio.audioBlob);
      reader.onload = () => {
        const base64AudioMessage = reader.result.split(',')[1];


        fetch('/api/upload_audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: base64AudioMessage })
        })
          .then(response => response.json())
          .then(data => {
            //            console.log(data);
            this.audioList.push({ fileName: data.fileName, active: "inactive", duration: this.recordMTime });

            this.recordTime.mm = 0;
            this.recordTime.ss = 0;
            this.recordTime.ss1 = 0;
            this.recordMTime = 0;

          })
      };

      return;
    },
    audio_select: function (e, index) {
      for (let audioItem of this.audioList) {
        audioItem.active = "inactive";
      }

      this.audioList[index].active = "audio-active";
      //      console.log(e.target, index);
    },
    addAudio: function () {

      window.clearInterval(this.polling);
      this.recordTime.mm = 0;
      this.recordTime.ss = 0;
      this.recordTime.ss1 = 0;
      this.recordMTime = 0;
      var filename = "";
      //audioItem.active == "audio-active", fileName, duration
      let activeFlag = 0;




      for (let audioItem of this.audioList) {

        if (audioItem.active === "audio-active") {

          activeFlag = 1;
          //set duration

          this.$store.dispatch("setData", {
            type: "audioDuration",
            value: audioItem.duration
          });

          filename = audioItem.fileName;


          //get new audioFrom
          let audioFrom = parseInt(this.$store.state.set.audioTo.mm) * 6000 + parseInt(this.$store.state.set.audioTo.ss) * 100 + this.$store.state.set.audioTo.ss1 + 2;

          //get new audioTo
          let audioTo = audioFrom + audioItem.duration;
          //set new audioFrom to store



          let audioFromObj = { mm: parseInt(audioFrom / 6000), ss: parseInt((audioFrom % 6000) / 100), ss1: parseInt((audioFrom % 6000) % 100) };
          let audioToObj = { mm: parseInt(audioTo / 6000), ss: parseInt((audioTo % 6000) / 100), ss1: parseInt((audioTo % 6000) % 100) };


          this.$store.dispatch("setData", {
            type: "audioFrom",
            value: audioFromObj
          });

          //set new audioTo to store          
          this.$store.dispatch("setData", {
            type: "audioTo",
            value: audioToObj
          });




        }
      }

      if (!activeFlag) {
        alert("Nothing is data to add.");
        return;
      }



      var payload = {
        type: "audios",
        value: {
          from: { ...this.$store.state.set.audioFrom },
          to: { ...this.$store.state.set.audioTo },
          filename: filename
        }
      };

      this.$store.dispatch("addToUploadDatas", payload);
      //      console.log("this.$store.state.upload.audios", this.$store.state.upload.audios);



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



      var fname = this.$store.state.set.fileName;
      axios.post('/api/save/' + fname, data).then(ret => {


        var payload = { type: "fileName", value: ret.data.filename };
        this.$store.dispatch("setData", payload);

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

      this.shapeFrom = { mm: 0, ss: 0, ss1: 0 };
      this.shapeTo = { mm: 0, ss: 0, ss1: 0 };

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

      this.$store.dispatch("timeToTimeObj", 1000);
      // console.log(str, "------------------------------");

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
          screenWidth: this.$store.state.set.screenWidth,
          screenHeight: this.$store.state.set.screenHeight,
          shapeFrom: { ...this.$store.state.set.shapeFrom },
          shapeTo: { ...this.$store.state.set.shapeTo },
          shapeContent: this.$store.state.set.shapeContent,
          shapeBorderColor: this.$store.state.set.shapeBorderColor,
          shapeBorderWidth: this.$store.state.set.shapeBorderWidth,
          shapeColor: this.$store.state.set.shapeColor,
          shapeOffsetWidth: this.$store.state.set.shapeOffsetWidth,
          shapeOffsetHeight: this.$store.state.set.shapeOffsetHeight,
          shapeOffsetTop: this.$store.state.set.shapeOffsetTop,
          shapeOffsetLeft: this.$store.state.set.shapeOffsetLeft
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



      this.$store.dispatch("addToUploadDatas", payload);
      var changeState = this.$store.state.set.changeState + 1;
      this.$store.dispatch("setData", {
        type: "changeState",
        value: changeState
      });



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

.shape-block {
  margin-bottom: 20px;
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

.shape-item:hover {
  cursor: pointer;
}

.shape-rectangle {
  width: 40px;
  height: 40px;
  background-color: #FFFFFF;
  margin: 5px;
}

input[type="color"] {
  cursor: pointer;
}



.shape-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFFFFF;
  margin: 5px;
}

.shape-horizontal {

  width: 40px;
  height: 6px;
  background-color: #FFFFFF;
  margin: 5px;
  margin-top: 20px;

}

.shape-vertical {

  width: 6px;
  height: 40px;
  background-color: #FFFFFF;
  margin: 5px;
  margin-left: 20px;

}

.shape-line-down {
  width: 60px;
  height: 60px;
  border-bottom: 5px solid white;
  -webkit-transform:
    translateY(-25px) translateX(15px) rotate(45deg);
  position: absolute;
}

.shape-line-up {
  width: 60px;
  height: 60px;
  border-bottom: 5px solid white;
  -webkit-transform:
    translateY(13px) translateX(15px) rotate(135deg);
  position: absolute;
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

.record-btn-group {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

/* input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
} */

.active {
  background-color: rgba(15, 15, 15, 0.5);
}

.record-audio {
  height: 30px !important;
}

.audio-active {
  border: solid 1px blue !important;
}

input[type="radio"] {
  cursor: pointer;
  margin-left: 5px;
  margin-right: 10px;
  border: none;
}

.btn-record {
  margin: 5px;
  margin-top: 20px;
}

textarea {
  color: black;
}

.audio-panel {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

}

.audio-div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.add-audio {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 90%;
}

#saved-audio-messages {
  height: 150px;
  width: 100%;
  text-align: center;
  overflow-y: scroll;
}

audio {
  height: 30px;
  width: 90%;
}



audio::-webkit-media-controls {
  width: inherit;
  height: inherit;
  position: relative;
  direction: ltr;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

audio::-webkit-media-controls-enclosure {
  width: 100%;
  max-width: 800px;
  height: 30px;
  flex-shrink: 0;
  bottom: 0;
  text-indent: 0;
  padding: 0;
  box-sizing: border-box;
}

audio::-webkit-media-controls-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* We use flex-start here to ensure that the play button is visible even
     * if we are too small to show all controls.
     */
  justify-content: flex-start;
  -webkit-user-select: none;
  position: relative;
  width: 100%;
  z-index: 0;
  overflow: hidden;
  text-align: right;
  bottom: auto;
  height: 30px;
  background-color: rgba(20, 20, 20, 0.5);
  border-radius: 5px;

  /* The duration is also specified in MediaControlElements.cpp and LayoutTests/media/media-controls.js */
  transition: opacity 0.3s;
}


audio:-webkit-full-page-media {
  max-height: 100%;
  max-width: 100%;
}

audio:-webkit-full-page-media::-webkit-media-controls-panel {
  bottom: 0px;
}

audio::-webkit-media-controls-mute-button {
  -webkit-appearance: media-mute-button;
  display: flex;
  flex: none;
  border: none;
  box-sizing: border-box;
  width: 35px;
  height: 30px;
  line-height: 30px;
  margin: 0 6px 0 0;
  padding: 0;
  background-color: initial;
  color: inherit;
}

audio::-webkit-media-controls-overlay-enclosure {
  display: none;
}

audio::-webkit-media-controls-play-button {
  -webkit-appearance: media-play-button;
  display: flex;
  flex: none;
  border: none;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-left: 9px;
  margin-right: 9px;
  padding: 0;
  background-color: initial;
  color: inherit;
}

audio::-webkit-media-controls-timeline-container {
  -webkit-appearance: media-controls-background;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1;
  -webkit-user-select: none;
  height: 16px;
  min-width: 0;
}

audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display {
  -webkit-appearance: media-current-time-display;
  -webkit-user-select: none;
  flex: none;
  display: flex;
  border: none;
  cursor: default;
  height: 30px;
  margin: 0 9px 0 0;
  padding: 0;
  line-height: 30px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  color: white;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0;
  text-shadow: none;
  text-decoration: none;
}

audio::-webkit-media-controls-timeline {
  -webkit-appearance: media-slider;
  display: flex;
  flex: 1 1 auto;
  height: 8px;
  margin: 0 15px 0 0;
  padding: 0;
  background-color: transparent;
  min-width: 25px;
  border: initial;
  color: inherit;
}



/* FIXME these shouldn't use special pseudoShadowIds, but nicer rules.
   https://code.google.com/p/chromium/issues/detail?id=112508
   https://bugs.webkit.org/show_bug.cgi?id=62218
*/
input[type="range" i]::-webkit-media-slider-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  /* This property is updated by C++ code. */
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(230, 230, 230, 0.35);
  border-radius: 4px;
  background-color: transparent;
  /* Background drawing is managed by C++ code to draw ranges. */
}

/* The negative right margin causes the track to overflow its container. */
input[type="range" i]::-webkit-media-slider-container>div {
  margin-right: -14px;
}

input[type="range" i]::-webkit-media-slider-thumb {
  margin-left: -7px;
  margin-right: -7px;
}

audio::-webkit-media-controls-fullscreen-button {
  -webkit-appearance: media-enter-fullscreen-button;
  display: flex;
  flex: none;
  border: none;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-left: -5px;
  margin-right: 9px;
  padding: 0;
  background-color: initial;
  color: inherit;
}

audio::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}


audio::-webkit-media-controls-fullscreen-volume-slider {
  display: none;
}

audio::-webkit-media-controls-fullscreen-volume-min-button {
  display: none;
}

audio::-webkit-media-controls-fullscreen-volume-max-button {
  display: none;
}
</style>