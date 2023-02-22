<template>
  <div v-if="this.$store.state.set.selectedSettingTool === `cut`" class="cut-range"
    :style="`width:${this.width}px;height:100%;background:transparent`" @mousemove="resizeMoved($event)"
    @mouseup="resizeReleased($event)">
    <div class="cut-range" :style="`left: ${this.cutStart}px; width:${this.cutWidth}px;`">
      <div class="cut-left" @mousedown="resizeSelected($event, 0)"></div>
      <div class="cut-text"></div>
      <div class="cut-right" @mousedown="resizeSelected($event, 1)" :style="`left: ${this.cutWidth - 6}px`"></div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";

export default {
  name: "CutFrameBar",
  props: {
    width: Number,
    start: Number
  },
  data() {
    return {
      cutWidth: 0,
      cutStart: 0,
      resizeState: false,
      resizeType: 0,
      resizeStart: 0,
      durationWidth: 120
    }
  },
  watch: {
    "$store.state.set.relaseFlag": function (newVal, oldVal) {
      var payload = { type: "relaseFlag", value: false }
      this.$store.dispatch("setData", payload);
      this.resizeState = false;
    },
    "$store.state.set.cutFrom": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.cutTo.mm * 6000 + this.$store.state.set.cutTo.ss * 100 + this.$store.state.set.cutTo.ss1;
      var from1 = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      var from = this.$store.state.set.cutFrom.mm * 6000 + this.$store.state.set.cutFrom.ss * 100 + this.$store.state.set.cutFrom.ss1;
      this.cutStart = 100 * (from - from1) / (100 * (this.$store.state.set.zoom - 6) * (-1));
      this.cutWidth = 100 * (to - from) / (100 * (this.$store.state.set.zoom - 6) * (-1));
    },
    "$store.state.set.cutTo": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.cutTo.mm * 6000 + this.$store.state.set.cutTo.ss * 100 + this.$store.state.set.cutTo.ss1;
      var from1 = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      var from = this.$store.state.set.cutFrom.mm * 6000 + this.$store.state.set.cutFrom.ss * 100 + this.$store.state.set.cutFrom.ss1;
      this.cutStart = 100 * (from - from1) / (100 * (this.$store.state.set.zoom - 6) * (-1));
      this.cutWidth = 100 * (to - from) / (100 * (this.$store.state.set.zoom - 6) * (-1));
    },
    "$store.state.set.videoFrom": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      this.cutStart = 0;
      this.cutWidth = 100 * (to - from) / (100 * (this.$store.state.set.zoom - 6) * (-1));
      var payload;

      payload = {
        type: "cutFrom", value: {
          mm: this.$store.state.set.videoFrom.mm,
          ss: this.$store.state.set.videoFrom.ss,
          ss1: this.$store.state.set.videoFrom.ss1
        }
      }
      this.$store.dispatch("setData", payload);

      payload = {
        type: "cutTo", value: {
          mm: this.$store.state.set.videoTo.mm,
          ss: this.$store.state.set.videoTo.ss,
          ss1: this.$store.state.set.videoTo.ss1
        }
      }
      this.$store.dispatch("setData", payload);

    },
    "$store.state.set.videoTo": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      this.cutStart = 0;
      this.cutWidth = 100 * (to - from) / (100 * (this.$store.state.set.zoom - 6) * (-1));
      var payload;

      payload = {
        type: "cutFrom", value: {
          mm: this.$store.state.set.videoFrom.mm,
          ss: this.$store.state.set.videoFrom.ss,
          ss1: this.$store.state.set.videoFrom.ss1
        }
      }
      this.$store.dispatch("setData", payload);

      payload = {
        type: "cutTo", value: {
          mm: this.$store.state.set.videoTo.mm,
          ss: this.$store.state.set.videoTo.ss,
          ss1: this.$store.state.set.videoTo.ss1
        }
      }
      this.$store.dispatch("setData", payload);

    },

  },
  mounted() {
    const store = useStore();
    this.cutWidth = this.width;
    this.cutStart = this.cutStart;
    this.durationWidth = 100 * (this.$store.state.set.duration.mm * 6000 + this.$store.state.set.duration.ss * 100 + this.$store.state.set.duration.ss1) / (100 * (this.$store.state.set.zoom - 6) * (-1));

  },
  methods: {
    resizeSelected: function (e, type) {
      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;
    },
    resizeMoved: function (e, type) {
      if (this.resizeState == true) {
        if (this.resizeType == 1) {



          if (parseInt(this.cutWidth) + e.x - this.resizeStart < 5) {
            this.resizeState = false;
            this.resizeStart = e.x;
            return;
          }

          if (this.cutWdith > this.durationWidth) {
            this.resizeState = false;
            this.resizeStart = e.x;
            return;
          }

          if (parseInt(this.cutWidth) > this.durationWidth) {

            this.resizeState = false;
            this.resizeStart = e.x;
            this.cutWidth = this.durationWidth;
            return;
          }

          this.cutWidth = parseInt(this.cutWidth) + e.x - this.resizeStart;


          var videoFromWidth = 100 * (this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1) / (100 * (this.$store.state.set.zoom - 6) * (-1));



          var cutToTime = parseInt((((videoFromWidth + this.cutStart + this.cutWidth) / 100) * 100) * ((-1) * (this.$store.state.set.zoom - 6)));


          this.$store.dispatch("setData", {
            type: "cutTo",
            value: {
              mm: parseInt((cutToTime) / (100 * 60)),
              ss: parseInt(((cutToTime) % (100 * 60)) / 100),
              ss1: parseInt(((cutToTime) % (100 * 60)) % 100),
            },
          });


        } else if (this.resizeType == 0) {
          if (parseInt(this.cutStart) + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            this.resizeStart = e.x;
            return;
          }
          if (parseInt(this.cutWidth) - (e.x - this.resizeStart) < 5) {
            this.resizeState = false;
            this.resizeStart = e.x;
            return;
          }
          this.cutStart += e.x - this.resizeStart;
          this.cutWidth = parseInt(this.cutWidth) - e.x + this.resizeStart;

          var videoFromWidth = 100 * (this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1) / (100 * (this.$store.state.set.zoom - 6) * (-1));


          var cutFromTime = parseInt((((videoFromWidth + this.cutStart) / 100) * 100) * ((-1) * (this.$store.state.set.zoom - 6)));


          this.$store.dispatch("setData", {
            type: "cutFrom",
            value: {
              mm: parseInt((cutFromTime) / (100 * 60)),
              ss: parseInt(((cutFromTime) % (100 * 60)) / 100),
              ss1: parseInt(((cutFromTime) % (100 * 60)) % 100),
            },
          });


        }
        this.resizeStart = e.x;
      }
    },
    resizeReleased: function (e) {

      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          if (parseInt(this.cutWidth) + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }
          this.cutWidth = parseInt(this.cutWidth) + e.x - this.resizeStart;
        } else if (this.resizeType == 0) {
          if (this.cutStart + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }

          this.cutStart += e.x - this.resizeStart;
          this.cutWidth = parseInt(this.cutWidth) - e.x + this.resizeStart;
        } else {
          if (this.cutStart + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }

          this.cutStart += e.x - this.resizeStart;
        }
      }
      this.resizeState = false;
    },
  },
};
</script>
<style scoped>
.cut-range {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: red;
  opacity: 0.5;
}


.cut-left {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 1px;
  top: 0px;
  width: 5px;
  border-radius: 3px;
  background-color: rgba(25, 255, 0, 0.9);
}

.cur-text {
  text-align: center;
}


.cut-right {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  right: 3px;
  top: 0px;
  width: 5px;
  border-radius: 3px;
  background-color: rgba(25, 255, 0, 0.9);
}




.cut-left:hover {
  cursor: col-resize;
}

.cut-right:hover {
  cursor: col-resize;
}
</style>