<template>
  <div>
    <div class="row-fluid" style="display: flex;height: 30px;">
      <div class="col-md-3">
        <button class="btn btn-primary btn-play" @click="onPlayPause">
          <i class="fa text-light" :class="[isPlay ? 'fa-pause' : 'fa-play']"></i>
        </button>
      </div>
      <div class="col-md-6 time-controller d-flex" style="justify-content: center; align-items: center">
        <TimeController />
      </div>
      <div class="col-md-3 zoom-controller">
        <ZoomController zoom="1" :setZoom="this.setZoom" />
      </div>
    </div>
    <div class="setting-panel">
      <div class="selectedPos"
        :style="`left: ${100 * (($store.state.set.curTime.mm) * 6000 + ($store.state.set.curTime.ss) * 100 + ($store.state.set.curTime.ss1)) / ((this.zoom - 6) * (-1) * 100) + 80}px`">
      </div>
      <TimeLineBar :zoom="this.zoom" :duration="this.duration" :curPosChanged="this.curPosChanged"
        :curPosSelected="this.curPosSelected" />
      <AudioBar :zoom="this.zoom" :duration="this.duration" />
      <FrameBar :zoom="this.zoom" :duration="this.duration" />
      <ShapeBar :zoom="this.zoom" :duration="this.duration" />
      <TextBar :zoom="this.zoom" :duration="this.duration" />
    </div>
  </div>
</template>

<script>
import TimeLineBar from "./subWorkingComponents/TimeLineBar.vue";
import AudioBar from "./subWorkingComponents/AudioBar.vue";
import FrameBar from "./subWorkingComponents/FrameBar.vue";

import ShapeBar from "./subWorkingComponents/ShapeBar.vue";
import TextBar from "./subWorkingComponents/TextBar.vue";

import TimeController from "./subWorkingComponents/TimeController.vue";
import ZoomController from "./subWorkingComponents/ZoomController.vue";

import { mapState, useStore } from "vuex";

export default {
  name: "WorkingPanel",
  components: {
    TimeController,
    TimeLineBar,
    AudioBar,
    FrameBar,
    ShapeBar,
    TextBar,
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
  watch: {
    "$store.state.set.curTime": function (newZoom, oldZoom) {

      console.log('curtime changed', this.$store.state.set.curTime);
      console.log('duration ', this.$store.state.set.duration);

      if (this.$store.state.set.curTime.mm * 6000 + this.$store.state.set.curTime.ss * 100 + this.$store.state.set.curTime.ss1 >= this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1) {

        console.log('curtime = duration');

        this.$store.dispatch("setData", {
          type: "curTime",
          value: {
            mm: 0,
            ss: 0,
            ss1: 0
          }
        });
      }
    },
  },

  mounted() { },
  methods: {
    setZoom(value) {
      this.zoom = value;
      var zoomVal = this.stateZoom;
      payload = { type: "zoom", zoomVal };
      this.$store.dispatch("setData", payload);

    },
    curPosChanged(e) {
      this.curPos = e.pageX + document.getElementsByClassName('setting-panel')[0].scrollLeft;
    },
    curPosSelected(e) {
      //      this.selectedPos = this.curPos;
      if (this.isPlay) this.onPlayPause();
      var curTime = parseInt((((this.curPos - 100) / 100) * 100) * ((-1) * (this.zoom - 6)));

      this.$store.dispatch("setData", {
        type: "curTime",
        value: {
          mm: parseInt(
            (curTime) / (100 * 60)
          ),
          ss: parseInt(
            (curTime % 6000) / 100
          ),
          ss1: parseInt(
            (curTime) % 100
          ),
        },
      });
    },
    onPlayPause() {
      this.$store.dispatch("setData", { type: "isPlay", value: !this.isPlay });
      if (this.isPlay) this.timerId = setInterval(this.onPlaying, 100);
      else clearInterval(this.timerId);
    },
    onPlaying() {
      const tempTime = { ...this.curTime };
      tempTime.ss1 += 10;
      tempTime.ss += parseInt(tempTime.ss1 / 100);
      tempTime.ss1 %= 100;
      tempTime.mm += parseInt(tempTime.ss / 60);
      tempTime.ss %= 60;
      this.$store.dispatch("setData", {
        type: "curTime",
        value: { ...tempTime },
      });
      if (
        tempTime.mm > this.videoLength.mm ||
        (tempTime.mm === this.videoLength.mm &&
          (tempTime.ss > this.videoLength.ss ||
            (tempTime.ss === this.videoLength.ss &&
              tempTime.ss1 > this.videoLength.ss1)))
      )
        this.onPlayPause();
    },
  },
  computed: {
    ...mapState({
      isPlay: (state) => state.set.isPlay,
      curTime: (state) => state.set.curTime,
      videoLength: (state) => state.set.duration,
    }),
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

.btn-play {
  margin-left: 15px;
  margin-top: 5px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-left: 15px;
  position: absolute;
  z-index: 10;

}
</style>