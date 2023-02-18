<template>
  <div class="text-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:10px;">
      <i class="fa fa-file-text fa-1x"></i>
    </div>
    <div class="div-range" :style="`left: ${start}px; width:${width}px;`">
      <div class="left" @mousedown="resizeSelected($event, 0)"></div>
      <div class="text" @mousedown="resizeSelected($event, 2)">Text</div>
      <div class="right" @mousedown="resizeSelected($event, 1)" :style="`left: ${width - 11}px`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextBar",
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
    },
  },
  methods: {
    resizeSelected(e, type) {
      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;

    },
    resizeMoved(e) {
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
    }
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
  background-color: rgb(244, 162, 30);
  margin: 10px 0px;
  border-radius: 5px;
}

.left {
  position: absolute;
  border: none;
  border-left: solid 2px rgba(255, 255, 255, 0.6);
  height: 35%;
  left: 11px;
  top: 8px;
  width: 0px;
}

.left:hover {
  cursor: col-resize;
}

.text {
  text-align: center;
}

.text:hover {
  cursor: move;
}


.right {
  position: absolute;
  border: none;
  border-left: solid 2px rgba(255, 255, 255, 0.6);
  height: 35%;
  left: 190px;
  top: 8px;
  width: 0px;
}

.right:hover {
  cursor: col-resize;
}

.text-bar {
  background-color: rgb(20, 20, 20);
  color: white;
  margin-top: 10px;
}

.text-bar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
