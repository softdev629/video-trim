<style scoped>
label {
  padding: 20px 0px;
}
</style>

<template>
  <div class="frame-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px;`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:20px;">
      <i class="fa fa-video-camera"></i>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool === `trim`" class="div-range active"
      :style="`left: ${start}px; width:${width}px;`">
      <div class="left" @mousedown="resizeSelected($event, 0)"></div>
      <div class="text" @mousedown="resizeSelected($event, 2)">
        <div v-for="i in currentImageCount" :style="`background:url(fr5/00${parseInt(
          (firstImage + ((lastImage - firstImage) / currentImageCount) * i) /
          10
        )}${parseInt(
          (firstImage + ((lastImage - firstImage) / currentImageCount) * i) %
          10
        )}.jpg);width:120px;height:67.5px;background-size:cover;`"></div>
      </div>
      <div class="right" @mousedown="resizeSelected($event, 1)" :style="`left: ${width - 7}px`"></div>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool !== `trim`" class="div-range "
      :style="`left: ${start}px; width:${width}px;`">
      <div class="left"></div>
      <div class="text">
        <div v-for="i in currentImageCount" :style="`background:url(fr5/00${parseInt(
          (firstImage + ((lastImage - firstImage) / currentImageCount) * i) /
          10
        )}${parseInt(
          (firstImage + ((lastImage - firstImage) / currentImageCount) * i) %
          10
        )}.jpg);width:120px;height:67.5px;background-size:cover;`"></div>
      </div>
      <div class="right" :style="`left: ${width - 7}px`"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: "FrameBar",
  props: {
    zoom: Number,
    duration: Number
  },
  data() {
    return {
      start: 0,
      width: 200,
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
      imageCount: 63,
      firstImage: 0,
      lastImage: 63,
      currentImageCount: 0
    };
  },
  watch: {
    zoom: function (newZoom, oldZoom) {
      //      this.start = this.start / oldZoom;
      this.width = 100 * (this.duration) / (100 * (newZoom - 6) * (-1));

      this.updateImages();
    },
    // "$store.state.set.videoFrom": function (newVal, oldVal) {
    //   //to-from to pixel
    //   //calc width
    //   var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
    //   var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
    //   this.width = 100 * (to - from) / (100 * (this.zoom - 6) * (-1));
    // },
    "$store.state.set.videoTo": function (newVal, oldVal) {
      //to-from to pixel
      //calc width
      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;
      this.width = 100 * (to - from) / (100 * (this.zoom - 6) * (-1));
    },
    "$store.state.set.delay": function (newVal, oldVal) {
      //delay to pixel
      var delay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;
      this.start = 100 * (delay) / (100 * (this.zoom - 6) * (-1));

      var to = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;
      var from = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

      var diff = (newVal.mm - oldVal.mm) * 6000 + (newVal.ss - oldVal.ss) * 100 + (newVal.ss1 - oldVal.ss1)

      this.width = 100 * (to - from - diff) / (100 * (this.zoom - 6) * (-1));


    },
  },
  mounted() {
    this.width = 100 * (this.duration) / (100 * (this.zoom - 6) * (-1));

    this.updateImages();
  },
  methods: {
    updateImages() {
      this.firstImage = parseInt(
        this.imageCount * (this.start / this.zoom / 1200)
      );
      this.lastImage = parseInt(
        this.imageCount * ((this.width) / this.zoom / 1200)
      );
      this.currentImageCount = parseInt(this.width / 120);
    },
    resizeSelected(e, type) {

      if (this.$store.state.set.selectedSettingTool !== 'trim')
        return;
      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;

    },
    resizeMoved(e) {
      if (this.$store.state.set.selectedSettingTool !== 'trim')
        return;

      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          //e.x-resizeStart + width > to -from ->px
          var to = 100 * (this.$store.state.set.to.mm * 6000 + this.$store.state.set.to.ss * 100 + this.$store.state.set.to.ss1) / (100 * (this.zoom - 6) * (-1));
          var from = 100 * (this.$store.state.set.from.mm * 6000 + this.$store.state.set.from.ss * 100 + this.$store.state.set.from.ss1) / (100 * (this.zoom - 6) * (-1));



          if (e.x - this.resizeStart + this.width > to - from) {
            this.resizeState = false;
            return;
          }

          if (this.width + e.x - this.resizeStart < 125) {
            this.resizeState = false;
            return;
          }
          this.width += e.x - this.resizeStart;
          this.updateImages();


          var videoEnd = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;

          var offset = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          videoEnd += offset;

          this.$store.dispatch("setData", {
            type: "videoTo",
            value: {
              mm: parseInt((videoEnd) / (100 * 60)),
              ss: parseInt(((videoEnd) % (100 * 60)) / 100),
              ss1: parseInt(((videoEnd) % (100 * 60)) % 100),
            },
          });

        } else if (this.resizeType == 0) {
          //resizeStart -e.x + width > to -from


          var to = 100 * (this.$store.state.set.to.mm * 6000 + this.$store.state.set.to.ss * 100 + this.$store.state.set.to.ss1) / (100 * (this.zoom - 6) * (-1));
          var from = 100 * (this.$store.state.set.from.mm * 6000 + this.$store.state.set.from.ss * 100 + this.$store.state.set.from.ss1) / (100 * (this.zoom - 6) * (-1));


          if (this.resizeStart - e.x + this.width > to - from) {
            this.resizeState = false;
            return;
          }

          if (this.width - e.x + this.resizeStart < 125) {
            this.resizeState = false;
            return;
          }

          var videoStart = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

          var offset = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          videoStart += offset;

          this.$store.dispatch("setData", {
            type: "videoFrom",
            value: {
              mm: parseInt((videoStart) / (100 * 60)),
              ss: parseInt(((videoStart) % (100 * 60)) / 100),
              ss1: parseInt(((videoStart) % (100 * 60)) % 100),
            },
          });

          var prevDelay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;

          console.log('----------------delay---------------');

          this.$store.dispatch("setData", {
            type: "delay",
            value: {
              mm: parseInt((prevDelay + offset) / (100 * 60)),
              ss: parseInt(((prevDelay + offset) % (100 * 60)) / 100),
              ss1: parseInt(((prevDelay + offset) % (100 * 60)) % 100),
            },
          });



          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
          this.updateImages();


        } else {
          if (this.start + e.x - this.resizeStart < 0) {
            this.resizeState = false;
            return;
          }
          this.start += e.x - this.resizeStart;


          var delay = parseInt((((e.x - this.resizeStart) / 100) * 100) * ((-1) * (this.zoom - 6)));

          var videoStart = this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1;

          var videoEnd = this.$store.state.set.videoTo.mm * 6000 + this.$store.state.set.videoTo.ss * 100 + this.$store.state.set.videoTo.ss1;



          var prevDelay = this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1;
          prevDelay += delay;



          console.log('----------------delay---------------');

          this.$store.dispatch("setData", {
            type: "delay",
            value: {
              mm: parseInt((prevDelay) / (100 * 60)),
              ss: parseInt(((prevDelay) % (100 * 60)) / 100),
              ss1: parseInt(((prevDelay) % (100 * 60)) % 100),
            },
          });

        }
        this.resizeStart = e.x;

      }

    },
    resizeReleased(e) {
      if (this.resizeState == true) {
        if (this.resizeType == 1) {
          if (this.width + e.x - this.resizeStart < 0) return;
          this.width += e.x - this.resizeStart;
        } else if (this.resizeType == 1) {
          if (this.start + e.x - this.resizeStart < 0) return;
          this.start += e.x - this.resizeStart;
          this.width -= e.x - this.resizeStart;
        } else {
          if (this.start + e.x - this.resizeStart < 0) return;
          this.start += e.x - this.resizeStart;
        }
      }
      this.resizeState = false;
      this.updateImages();
    },
  },
};
</script>
<style scoped>
label {
  padding: 20px 0px;
}

.div-range {
  position: relative;
  left: 0px;
  width: 200px;
  text-indent: 0px;
  background-color: rgb(17, 67, 62);
  border-radius: 5px;
}

.left {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 0px;
  top: 0px;
  width: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
}



.text {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}


.right {
  position: absolute;
  border: none;
  /*  border-left: solid 4px rgba(255, 255, 255, 0.6);*/
  height: 100%;
  left: 210px;
  top: 0px;
  width: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.5);
}


img {
  width: 110px;
}

.frame-bar {
  background-color: rgb(20, 20, 20);
  color: white;
  margin-top: 10px;
}

.frame-bar:hover {
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
