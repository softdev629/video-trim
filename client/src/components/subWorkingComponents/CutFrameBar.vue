<template>
  <div v-if="this.$store.state.set.selectedSettingTool === `cut`" class="cut-range"
    :style="`left: ${this.cutStart}px; width:${this.cutWidth}px;`" @mousemove="resizeMoved($event)"
    @mouseup="resizeReleased($event)">
    <div class="cut-left" @mousedown="resizeSelected($event, 0)"></div>
    <div class="cut-text"></div>
    <div class="cut-right" @mousedown="resizeSelected($event, 1)" :style="`left: ${this.cutWidth - 10}px`"></div>
  </div>
</template>
<script>
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
    }
  },
  watch() {

  },
  mounted() {
    this.cutWidth = this.width;
    this.cutStart = this.cutStart;
  },
  created() {

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
          console.log('I am a right');
          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);
          if (parseInt(this.cutWidth) + e.x - this.resizeStart < 125) return;

          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);
          this.cutWidth = parseInt(this.cutWidth) + e.x - this.resizeStart;

          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);

        } else if (this.resizeType == 0) {
          console.log('I am a left');
          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);
          if (parseInt(this.cutStart) + e.x - this.resizeStart < 0) return;
          if (parseInt(this.cutWidth) - (e.x - this.resizeStart) < 125) return;
          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);
          this.cutStart += e.x - this.resizeStart;
          this.cutWidth = parseInt(this.cutWidth) - e.x - this.resizeStart;
          console.log('cutWidth', parseInt(this.cutWidth), 'e.x', e.x, 'this.resizeStart', this.resizeStart);
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
          this.cutWidth = parseInt(this.cutWidth) - e.x - this.resizeStart;
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
  border: 3px solid white;
  opacity: 0.5;
}


.cut-left {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 0px;
  top: 0px;
  width: 6px;
  border-radius: 3px;
  background-color: rgba(25, 255, 0, 0.9);
}




.cut-right {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 210px;
  top: 0px;
  width: 6px;
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