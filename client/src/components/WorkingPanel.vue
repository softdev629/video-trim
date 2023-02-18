<template>
  <div>
    <div class="row-fluid" style="display: flex;height: 30px;">
      <div class="col-md-3"></div>
      <div class="col-md-6 time-controller d-flex" style="justify-content: center; align-items: center">
        <TimeController />
      </div>
      <div class="col-md-3 zoom-controller">
        <ZoomController zoom="1" :setZoom="this.setZoom" />
      </div>
    </div>
    <div class="setting-panel">
      <!-- <div class="curPos" :style="`left: ${curPos}px`" @mousedown="curPosSelected($event)"></div> -->
      <div class="selectedPos"
        :style="`left: ${100 * ($store.state.set.curTime.mm * 6000 + $store.state.set.curTime.ss * 100 + $store.state.set.curTime.ss1) / ((this.zoom - 6) * (-1) * 100) + 80}px`">
      </div>
      <TimeLineBar :zoom="this.zoom" :duration="this.duration" :curPosChanged="this.curPosChanged"
        :curPosSelected="this.curPosSelected" />
      <AudioBar :zoom="this.zoom" :duration="this.duration" />
      <FrameBar :zoom="this.zoom" :duration="this.duration" />
      <ShapeBar :zoom="this.zoom" />
      <TextBar :zoom="this.zoom" />
    </div>
  </div>
</template>

<script>
import TimeLineBar from "./subWorkingComponents/TimeLineBar.vue";
import AudioBar from "./subWorkingComponents/AudioBar.vue";
import FrameBar from "./subWorkingComponents/FrameBar.vue";
import ShapeBar from "./subWorkingComponents/ShapeBar.vue";
import TextBar from "./subWorkingComponents/TextBar.vue";
import TimeSelectedBar from "./subWorkingComponents/TimeSelectedBar.vue";
import TimeMovedBar from "./subWorkingComponents/TimeMovedBar.vue";
import TimeController from "./subWorkingComponents/TimeController.vue";
import ZoomController from "./subWorkingComponents/ZoomController.vue";

import { useStore } from "vuex";

export default {
  name: "WorkingPanel",
  components: {
    TimeController,
    TimeLineBar,
    AudioBar,
    FrameBar,
    ShapeBar,
    TextBar,
    TimeSelectedBar,
    TimeMovedBar,
    ZoomController,
  },
  data() {
    return {
      zoom: 1,
      duration: this.$store.state.set.duration.mm * 60 * 100 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1,
      curPos: 0,
      selectedPos: 0,
    };
  },
  mounted() { },
  methods: {
    setZoom(value) {
      this.zoom = value;
      // switch (parseInt(value)) {
      //   case 1:
      //     this.zoom = 0.25;
      //     break;
      //   case 2:
      //     this.zoom = 0.5;
      //     break;
      //   case 3:
      //     this.zoom = 1;
      //     break;
      //   case 4:
      //     this.zoom = 2;
      //     break;
      //   default:
      //     this.zoom = 4;
      //     break;
      // }
    },
    curPosChanged(e) {
      this.curPos = e.pageX + document.getElementsByClassName('setting-panel')[0].scrollLeft;
      console.log(this.curPos, '---CurPos------');
    },
    curPosSelected(e) {
      this.selectedPos = this.curPos;
      console.log(this.zoom, ((this.curPos - 100) / 100) * 100);
      var curTime = parseInt((((this.curPos - 100) / 100) * 100) * ((-1) * (this.zoom - 6)));

      console.log(curTime, '--------CurTime---------');

      this.$store.dispatch("setData", {
        type: "curTime",
        value: {
          mm: parseInt(
            (curTime) / (100 * 60)
          ),
          ss: parseInt(
            (curTime) / 100
          ),
          ss1: parseInt(
            (curTime) % 100
          ),
        },
      });



    },
  },
};
</script>

<style scoped>
.setting-panel {
  max-width: 1400px;
  overflow-x: auto;
  position: relative;
}

.curPos {
  border: none;
  position: absolute;
  border-right: solid 3px rgba(0, 0, 255, 0.3);
  width: 3px;
  height: 100%;
  top: 0px;
  z-index: 50;
}

.selectedPos {
  border: none;
  position: absolute;
  border-right: solid 3px rgba(0, 0, 255, 0.8);
  width: 3px;
  height: 98%;
  top: 10px;
  z-index: 51;
}
</style>