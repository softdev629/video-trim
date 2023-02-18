<template>
  <div class="setting-panel"
    :style="` width:${this.$store.state.set.settingBoxWidth}px; height:${this.$store.state.set.panelHeight}px`"
    v-if="this.$store.state.set.selectedSettingTool !== 0">
    <div class="setting-panel-close" v-if="this.$store.state.set.selectedSettingTool !== 0"><a @click="close()">
        <i class="fa fa-chevron-left"></i></a></div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `trim`">
      <div style="display:flex;justify-content: center;">
        <label style="width:50px;text-align: right;">From&nbsp;&nbsp;:</label>
        <Timepicker :timeData="`stimeData`" @timeChange="stimeChange" />
      </div>
      <div style="display:flex; margin-top:10px;justify-content: center;">
        <label style="width:50px;text-align: right;">To&nbsp;&nbsp;:</label>
        <Timepicker :timeData="`etimeData`" @timeChange="etimeChange" />
      </div>
      <div>
        <button class="btn btn-success btn-tool" @click="trim()">Save</button>
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `audio`">
      <div style="display:flex;justify-content: space-between;">
        <button class="btn btn-info btn-tool" style="margin-top:0px;" @click="record()"><i
            class="fa fa-microphone"></i></button>
        <label style="margin-top:5px;">{{ `${recordTime.mm}:${recordTime.ss}.${recordTime.ss1}
        `}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
      </div>
      <div style="display:flex;justify-content: space-between;">
        <button class="btn btn-danger btn-tool" @click="recordRestart()">{{ this.btnType }}</button>
        <button class="btn btn-primary btn-tool" @click="clear()">Clear</button>
        <button class="btn btn-success btn-tool" @click="recordAdd()">Add</button>
      </div>
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `text`">
      <div class="row">
        <div class="col-md-12">
          <button class="btn my-btn btn-success">Add Subtitle</button>
        </div>
        <div class="form-group" style="margin:0px;">
          <div class="col-md-12  relative-div" style="position:relative;">
            <i class="fa fa-close text-close absolute-div" style="display:none"></i>
            <textarea v-model="this.$store.state.set.textContent" @keyup="change(`textContent`)"
              class="sub-title-text absolute-div"></textarea>
          </div>
        </div>
        <div class="form-group" style="display:flex;justify-content: space-between;">
          <div style="display:flex;">
            <Timepicker :timeData="stimeData" @timeChange="sTextTimeChange" />
          </div>
          <div>
            <input type="color" v-model="this.$store.state.set.textColor" @change="change(`textColor`)" />
          </div>
          <div style="display:flex;">
            <Timepicker :timeData="etimeData" @timeChange="eTextTimeChange" />
          </div>
        </div>
        <!-- <div class="form-group">
          <div class="col-md-7 right">
            <label>Offset Width&nbsp;&nbsp;&nbsp;</label>
          </div>
          <div class="col-md-5 left">
            <input v-model="this.$store.state.set.textOffsetWidth" @change="change(`textOffsetWidth`)" type="number"
              min="0" max="1000" />
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-7 right">
            <label>Offset Height&nbsp;&nbsp;&nbsp;</label>
          </div>
          <div class="col-md-5 left">
            <input v-model="this.$store.state.set.textOffsetHeight" @change="change(`textOffsetHeight`)" type="number"
              min="0" max="1000" />
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-7 right">
            <label>Offset Top&nbsp;&nbsp;&nbsp;</label>
          </div>
          <div class="col-md-5 left">
            <input v-model="this.$store.state.set.textOffsetTop" @change="change(`textOffsetTop`)" type="number" min="0"
              max="1000" />
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-7 right">
            <label>Offset Left&nbsp;&nbsp;&nbsp;</label>
          </div>
          <div class="col-md-5 left">
            <input v-model="this.$store.state.set.textOffsetLeft" @change="change(`textOffsetLeft`)" type="number"
              min="0" max="1000" />
          </div>
        </div> -->
      </div>
      <!-- <div class="btn-div">
        <button class="btn btn-primary btn-tool" @click="textContent(`textContent`)">commit</button>
      </div> -->
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `shape`">
      <div class="form-group">
        <div class="col-md-12">
          <div class="shape-box">
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change(`rectangle`)" data-type="rectangle">
              <!-- <i class="fa fa-check text-close absolute-div" style="display:none"></i> -->
              <div class="shape-rectangle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change(`circle`)" data-type="circle">
              <!-- <i class="fa fa-check text-close absolute-div" style="display:none"></i> -->
              <div class="shape-circle absolute-div"></div>
            </div>
            <div class="shape-item relative-div" style="position:relative;" @mouseover="showIcon($event)"
              @mouseout="notShowIcon($event)" @click="change(`line`)" data-type="line">
              <!-- <i class="fa fa-check text-close absolute-div" style="display:none"></i> -->
              <div class="shape-line absolute-div"></div>
            </div>
          </div>

          <!-- <select v-model="this.$store.state.set.shapeContent" @change="change(`shapeContent`)">
            <option value="line">Line</option>
            <option value="circle">Ellipse</option>
            <option value="rectangle">Rectangle</option>
          </select> -->
        </div>
      </div>

      <div class="form-group" style="display:flex;justify-content: space-between;">
        <div style="display:flex;">
          <Timepicker :timeData="stimeData" @timeChange="sShapeTimeChange" />
        </div>
        <div>
          <input v-model="this.$store.state.set.shapeBorderColor" @change="change('shapeBorderColor')" type="color" />
        </div>
        <div style="display:flex;">
          <Timepicker :timeData="etimeData" @timeChange="eShapeTimeChange" />
        </div>
      </div>

      <div class="form-group">
        <div class="col-md-7 right">
          <label>Offset Width&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left ">
          <input v-model="this.$store.state.set.shapeOffsetWidth" @change="change(`shapeOffsetWidth`)" type="number"
            min="0" max="1000" />
        </div>
      </div>
      <div class="form-group" v-if="this.$store.state.set.shapeContent === `rectangle`">
        <div class="col-md-7 right">
          <label>Offset Height&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetHeight" @change="change(`shapeOffsetHeight`)" type="number"
            min="0" max="1000" />
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-7 right">
          <label>Offset Top&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetTop" @change="change(`shapeContent`)" type="number" min="0"
            max="1000" />
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-7 right">
          <label>Offset Left&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-md-5 left">
          <input v-model="this.$store.state.set.shapeOffsetLeft" @change="change(`shapeContent`)" type="number" min="0"
            max="1000" />
        </div>
      </div>
      <!-- <div class="btn-div">
        <button class="btn btn-primary btn-tool" @click="shapeContent()">commit</button>
      </div> -->
    </div>
    <div class="setting-panel-box" v-if="this.$store.state.set.selectedSettingTool === `reserved-menu`">
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import setStore from "../store/modules/set.module";
//import Timepicker from 'vue3-timepicker';
import Timepicker from "./subToolComponents/TimePicker.vue";
import "vue3-timepicker/dist/VueTimepicker.css";
import { ref } from "vue";

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

    this.stimeData.mm = this.$store.state.set.from.mm;
    this.stimeData.ss = this.$store.state.set.from.ss;
    this.stimeData.ss1 = this.$store.state.set.from.ss1;

    this.etimeData.mm = this.$store.state.set.to.mm;
    this.etimeData.ss = this.$store.state.set.to.ss;
    this.etimeData.ss1 = this.$store.state.set.to.ss1;


    this.textOffsetLeft = 300 + this.$store.state.set.toolSideBar + 5 + (this.panelWidth - this.$store.state.set.screenWidth) / 2;

    var payload = { type: "textOffsetLeft", value: this.textOffsetLeft };
    this.$store.dispatch("setData", payload);



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
      var payload = { type: "from", value: this.stimeData };
      this.$store.dispatch("setData", payload);

      payload = { type: "to", value: this.etimeData };
      this.$store.dispatch("setData", payload);

      alert("Commit is success.");
    },
    audioUpload: function () {

    },
    change: function (content) {
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
      this.shapeColor = "white";
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
      var payload = { type: "from", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

    },
    etimeChange: function (mm, ss, ss1) {
      var payload = { type: "to", value: { mm: mm, ss: ss, ss1: ss1 } };
      this.$store.dispatch("setData", payload);

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

      if (e.target.className.search('relative-div') >= 0) {
        e.target.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
      }
      else if (e.target.className.search('absolute-div') >= 0) {
        e.target.parentNode.style.backgroundColor = 'rgba(15, 15, 15, 0.5)';
      }

    },
    notShowIcon: function (e) {

      if (e.target.className.search('relative-div') >= 0) {
        e.target.style.backgroundColor = 'rgb(48, 48, 48)';
      }
      else if (e.target.className.search('absolute-div') >= 0) {
        e.target.parentNode.style.backgroundColor = 'rgb(48, 48, 48)';
      }
    },
  }
}
</script>

<style scoped>
.fa-chevron-left:hover {
  color: white;
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
  background-color: white;
  margin: 5px;
}

.shape-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  margin: 5px;
}

.shape-line {
  width: 40px;
  height: 6px;
  background-color: white;
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
  color: white;
}

.fa-check {
  position: absolute;
  right: -5px;
  top: -10px;
  width: 15px;
  color: rgb(13, 110, 253);
}


input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.active {
  background-color: rgba(15, 15, 15, 0.5);
}
</style>