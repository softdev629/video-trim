<style scoped>
label {
  padding: 20px 0px;
}
</style>

<template>
  <div class="shape-bar media-line" @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px`">
    <div style="margin-right: 10px; width:70px;margin-top:10px;">
      <i class="fa fa-microphone"></i>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool === `audio`" class="div-range active"
      :style="`left: ${start}px; width:${width}px;`">
      <div class="left" @mousedown="resizeSelected($event, 0)"></div>
      <div class="text" @mousedown="resizeSelected($event, 2)">Audio</div>
      <div class="right" @mousedown="resizeSelected($event, 1)" :style="`left: ${width - 7}px`"></div>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool !== `audio`" class="div-range"
      :style="`left: ${start}px; width:${width}px;`">
      <div class="left"></div>
      <div class="text">Audio</div>
      <div class="right" :style="`left: ${width - 7}px`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AudioBar",
  props: {
    zoom: Number,
  },
  data() {
    return {
      start: 0,
      width: 200,
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
    };
  },
  watch: {
    zoom: function (newZoom, oldZoom) {
      this.start = this.start / oldZoom;
      this.width = this.width / oldZoom;
      this.start = this.start * newZoom;
      this.width = this.width * newZoom;

      if (this.width < 100) this.width = 100;
    },
  },
  methods: {
    resizeSelected(e, type) {
      if (this.$store.state.set.selectedSettingTool !== 'audio')
        return;

      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;

    },
    resizeMoved(e) {
      if (this.$store.state.set.selectedSettingTool !== 'audio')
        return;

      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          if (this.width + e.x - this.resizeStart < 100) return;
          this.width += e.x - this.resizeStart;
        } else if (this.resizeType == 0) {
          if (this.start + e.x - this.resizeStart < 0) return;
          if (this.width - (e.x - this.resizeStart) < 100) return;
          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
        } else {
          if (this.start + e.x - this.resizeStart < 0) return;
          this.start += e.x - this.resizeStart;
        }
        this.resizeStart = e.x;
      }
    },
    resizeReleased(e) {

      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          if (this.width + e.x - this.resizeStart < 100) return;
          this.width += e.x - this.resizeStart;
        } else if (this.resizeType == 1) {
          if (this.start + e.x - this.resizeStart < 0) return;
          if (this.width - (e.x - this.resizeStart) < 100) return;
          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
        } else {
          if (this.start + e.x - this.resizeStart < 0) return;
          this.start += e.x - this.resizeStart;
        }
      }
      this.resizeState = false;
    },
  },
};
</script>
<style scoped>
label {
  padding: 10px 0px;
}

.div-range {
  position: relative;
  left: 0px;
  width: 200px;
  text-indent: 0px;
  background-color: rgb(17, 67, 62);
  margin: 10px 0px;
  border-radius: 5px;
}

.left {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  /* border: none; */
  /* border-left: solid 2px rgba(255, 255, 255, 0.6); */
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  width: 6px;
}


.text {
  text-align: center;
}


.right {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  /* border: none; */
  /* border-left: solid 2px rgba(255, 255, 255, 0.6); */
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  width: 6px;
}


.shape-bar {
  background-color: rgb(20, 20, 20);
  color: white;
  margin-top: 10px;
}

.shape-bar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active {
  /* border: solid 1px #1620FF; */
  border: solid 2px #FFFFFF;
}

.active>.text:hover {
  cursor: move;
}

.active>.left:hover {
  cursor: col-resize;
}

.active>.right:hover {
  cursor: col-resize;
}
</style>
