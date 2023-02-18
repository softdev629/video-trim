<template>
  <div class="screen" @mousemove="selectMove($event)" @mouseover="mouseOverFunc($event)"
    @mouseout="mouseOutFunc($event)"
    :style="`width:${this.$store.state.set.panelWidth }px;height:${this.$store.state.set.panelHeight}px;`">
    <video controls class="size1" @oncanplay="getDuration()" src="bear.mp4"
      :style="`width:${this.$store.state.set.screenWidth}px;height:${this.$store.state.set.screenHeight}px;`"
      type="video/mp4" ref="vid" @timeupdate="curTimeChange($event)"></video>
    <!-- <video controls class="size1" @oncanplay="getDuration()" src="localhost:3000/videos/bear.mp4"
      :style="`width:${this.$store.state.set.screenWidth}px;height:${this.$store.state.set.screenHeight}px;`"
      type="video/mp4" ref="vid" @timeupdate="curTimeChange($event)"></video> -->
    <div class="text-section" v-if="this.$store.state.set.selectedSettingTool === `text`"
      :style="`width:${this.$store.state.set.textOffsetWidth}px; height:${this.$store.state.set.textOffsetHeight}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.textOffsetLeft}px;top:${this.$store.state.set.textOffsetTop}px; color:${this.$store.state.set.textColor};background-color: transparent; border:solid 0.5px ${this.$store.state.set.textBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)" style="text-align:center">
      {{ this.$store.state.set.textContent }}
      <div class="text-resize" id="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"
        :style="`display:${show}`">
      </div>
    </div>
    <div class="shape-section"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `rectangle`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetHeight}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft}px;top:${this.$store.state.set.shapeOffsetTop}px; background-color: transparent; border:solid 2px ${this.$store.state.set.shapeBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `line`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:0px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft}px;top:${this.$store.state.set.shapeOffsetTop}px; background-color: transparent; border:solid 2px ${this.$store.state.set.shapeBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `circle`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetWidth}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft}px;top:${this.$store.state.set.shapeOffsetTop}px; background-color: transparent; border:solid 2px ${this.$store.state.set.shapeBorderColor};border-radius:50%`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
  </div>
</template>

<script >
import { useStore } from "vuex";
import setStore from "../store/modules/set.module";

export default {
  name: "ScreenPanel",
  data() {
    return {
      width: 600,
      height: 270,
      panelWidth: 600,
      panelHeight: 270,
      duration: { mm: 0, ss: 0, ss1: 0 },
      startPos: {
        x: 0,
        y: 0
      },
      selectState: 0,
      show: 'none'
    };
  },
  mounted() {
    const store = useStore();
    this.width = setStore.state.screenWidth;
    this.height = setStore.state.screenHeight;


    if (!setStore.state.selectedSettingTool)
      this.panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + setStore.state.settingBoxWidth - 3);
    else
      this.panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + setStore.state.settingBoxWidth + 40 + 1);



    if (this.height / this.panelWidth < setStore.state.screenRate) {
      this.panelHeight = setStore.state.screenHeight;
    }
    else {
      this.panelHeight = this.panelWidth * setStore.state.screenRate;
    }

    this.$store.dispatch('setData', {
      type: 'panelWidth',
      value: this.panelWidth
    });

    this.$store.dispatch('setData', {
      type: 'panelHeight',
      value: this.panelHeight
    });


  },
  methods: {
    mouseOverFunc(e) {
      this.$store.dispatch('setData', {
        type: 'textBorderColor',
        value: 'rgb(16,16,16)'
      });

      this.show = "block";

    },
    mouseOutFunc(e) {
      this.$store.dispatch('setData', {
        type: 'textBorderColor',
        value: 'transparent'
      });

      this.show = "none";

    },
    getDuration: function () {
      //      console.log(document.getElementsByTagName('video')[0].duration, '---------video duration------');
    },
    selectText: function (e) {

      if (e.target.classList[0] == 'text-resize') {
        return;
      }

      this.selectState = 1;

      this.startPos = {
        x: e.x,
        y: e.y
      }
    },
    selectResizeText: function (e) {

      this.selectState = 2;

      this.startPos = {
        x: e.x,
        y: e.y
      }
    },
    selectMove: async function (e) {
      if (this.selectState == 0)
        return;

      let offsetX = e.x - this.startPos.x;
      let offsetY = e.y - this.startPos.y;

      this.startPos = {
        x: e.x,
        y: e.y
      }


      if (this.$store.state.set.selectedSettingTool === 'text') {

        if (this.$store.state.set.textOffsetLeft < (this.$store.state.set.settingBoxWidth + 40 + this.$store.state.set.screenYControllerWidth + this.$store.state.set.toolSideBar + (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2)) {
          this.$store.dispatch('setData', {
            type: 'textOffsetLeft',
            value: this.$store.state.set.textOffsetLeft + 10
          });
          this.selectState = 0;
          return;
        }

        if ((this.$store.state.set.textOffsetLeft + this.$store.state.set.textOffsetWidth) > (this.$store.state.set.settingBoxWidth + 40 + this.$store.state.set.screenYControllerWidth + this.$store.state.set.toolSideBar + (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2) + this.$store.state.set.screenWidth) {
          this.$store.dispatch('setData', {
            type: 'textOffsetLeft',
            value: this.$store.state.set.textOffsetLeft - 10
          });
          this.selectState = 0;
          return;
        }

        if (this.$store.state.set.textOffsetTop < 0) {
          this.$store.dispatch('setData', {
            type: 'textOffsetTop',
            value: this.$store.state.set.textOffsetTop + 5
          });
          this.selectState = 0;
          return;
        }

        if (this.$store.state.set.textOffsetTop + this.$store.state.set.textOffsetHeight > this.$store.state.set.panelHeight) {
          this.$store.dispatch('setData', {
            type: 'textOffsetTop',
            value: this.$store.state.set.textOffsetTop - 5
          });
          this.selectState = 0;
          return;
        }

        if (this.selectState == 1) {
          this.$store.dispatch("setData", {
            type: "textOffsetLeft",
            value: this.$store.state.set.textOffsetLeft + offsetX,
          });
          this.$store.dispatch("setData", {
            type: "textOffsetTop",
            value: this.$store.state.set.textOffsetTop + offsetY,
          });
        } else if (this.selectState == 2) {
          var width = this.$store.state.set.textOffsetWidth;
          var height = this.$store.state.set.textOffsetHeight;
          width = Number(width) + Number(offsetX);
          height = Number(height) + Number(offsetY);
          await this.$store.dispatch("setData", {
            type: "textOffsetWidth",
            value: width,
          });
          await this.$store.dispatch("setData", {
            type: "textOffsetHeight",
            value: height,
          });
        }
      }
      else {

        if (this.$store.state.set.shapeOffsetLeft < (this.$store.state.set.settingBoxWidth + 40 + this.$store.state.set.screenYControllerWidth + this.$store.state.set.toolSideBar + (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2)) {
          this.$store.dispatch('setData', {
            type: 'shapeOffsetLeft',
            value: this.$store.state.set.shapeOffsetLeft + 10
          });
          this.selectState = 0;
          return;
        }

        if ((this.$store.state.set.shapeOffsetLeft + this.$store.state.set.shapeOffsetWidth) > (this.$store.state.set.settingBoxWidth + 40 + this.$store.state.set.screenYControllerWidth + this.$store.state.set.toolSideBar + (this.$store.state.set.panelWidth - this.$store.state.set.screenWidth) / 2) + this.$store.state.set.screenWidth) {
          this.$store.dispatch('setData', {
            type: 'shapeOffsetLeft',
            value: this.$store.state.set.shapeOffsetLeft - 10
          });
          this.selectState = 0;
          return;
        }

        if (this.$store.state.set.shapeOffsetTop < 0) {
          this.$store.dispatch('setData', {
            type: 'shapeOffsetTop',
            value: this.$store.state.set.shapeOffsetTop + 5
          });
          this.selectState = 0;
          return;
        }

        if (this.$store.state.set.shapeOffsetTop + this.$store.state.set.shapeOffsetHeight > this.$store.state.set.panelHeight) {
          this.$store.dispatch('setData', {
            type: 'shapeOffsetTop',
            value: this.$store.state.set.shapeOffsetTop - 5
          });
          this.selectState = 0;
          return;
        }

        if (this.$store.state.set.selectedSettingTool === 'shape' && this.$store.state.set.shapeContent === 'rectangle') {

          if (this.selectState == 1) {
            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.$store.state.set.shapeOffsetLeft + offsetX
            });
            this.$store.dispatch('setData', {
              type: 'shapeOffsetTop',
              value: this.$store.state.set.shapeOffsetTop + offsetY
            });
          }
          else if (this.selectState == 2) {

            var width = this.$store.state.set.shapeOffsetWidth;
            var height = this.$store.state.set.shapeOffsetHeight;
            width = Number(width) + Number(offsetX);
            height = Number(height) + Number(offsetY);
            await this.$store.dispatch('setData', {
              type: 'shapeOffsetWidth',
              value: width
            });

            await this.$store.dispatch('setData', {
              type: 'shapeOffsetHeight',
              value: height
            });
          }
        }
        else if (this.$store.state.set.selectedSettingTool === 'shape' && this.$store.state.set.shapeContent === 'circle') {

          if (this.selectState == 1) {

            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.$store.state.set.shapeOffsetLeft + offsetX
            });
            this.$store.dispatch('setData', {
              type: 'shapeOffsetTop',
              value: this.$store.state.set.shapeOffsetTop + offsetY
            });
          }
          else if (this.selectState == 2) {

            var width = this.$store.state.set.shapeOffsetWidth;
            var height = this.$store.state.set.shapeOffsetHeight;
            width = Number(width) + Number(offsetX);
            height = Number(height) + Number(offsetY);
            await this.$store.dispatch('setData', {
              type: 'shapeOffsetWidth',
              value: width
            });

            await this.$store.dispatch('setData', {
              type: 'shapeOffsetHeight',
              value: height
            });
          }

        }
        else if (this.$store.state.set.selectedSettingTool === 'shape' && this.$store.state.set.shapeContent === 'line') {

          if (this.selectState == 1) {
            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.$store.state.set.shapeOffsetLeft + offsetX
            });
            this.$store.dispatch('setData', {
              type: 'shapeOffsetTop',
              value: this.$store.state.set.shapeOffsetTop + offsetY
            });
          }
          else if (this.selectState == 2) {

            var width = this.$store.state.set.shapeOffsetWidth;

            width = Number(width) + Number(offsetX);

            await this.$store.dispatch('setData', {
              type: 'shapeOffsetWidth',
              value: width
            });

          }

        }
      }

    },
    selectRelease: function (e) {
      this.selectState = 0;
    },
    curTimeChange: function (e) {
      const currentTime = e.target.currentTime;
      const compare = {
        mm: parseInt((currentTime * 100) / (100 * 60)),
        ss: parseInt((currentTime * 100) / 100),
        ss1: parseInt((currentTime * 100) % 100),
      };

      if (
        compare.mm === this.$store.state.set.curTime.mm &&
        compare.ss === this.$store.state.set.curTime.ss &&
        compare.ss1 === this.$store.state.set.curTime.ss1
      )
        return;
      this.$store.dispatch("setData", {
        type: "curTime",
        value: {
          mm: parseInt((currentTime * 100) / (100 * 60)),
          ss: parseInt((currentTime * 100) / 100),
          ss1: parseInt((currentTime * 100) % 100),
        },
      });
    },
  },
  watch: {
    "$store.state.set.curTime": function (val, oldVal) {
      if (val === oldVal) return;
      const currentTime = this.$refs.vid.currentTime;
      const compare = {
        mm: parseInt((currentTime * 100) / (100 * 60)),
        ss: parseInt((currentTime * 100) / 100),
        ss1: parseInt((currentTime * 100) % 100),
      };

      if (
        compare.mm === this.$store.state.set.curTime.mm &&
        compare.ss === this.$store.state.set.curTime.ss &&
        compare.ss1 === this.$store.state.set.curTime.ss1
      )
        return;
      this.$refs.vid.currentTime = (val.ss * 100 * 60 + val.ss * 100 + val.ss1) / 100;
    },
  },
};
</script>

<style scoped>
.screen {
  display: flex;
  justify-content: center;
  background-color: rgb(48, 48, 48);
}

.size1 {
  width: 600px;
  height: 450px;
}

.size2 {
  width: 800px;
  height: 450px;
}

.text-section {
  position: relative;
}

.text-section:hover {
  cursor: move;
}

.text-resize {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #0d6efd;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
}

.text-resize-over {
  background-color: transparent;
}

.text-resize:hover {
  cursor: se-resize;
  background-color: #0a40be;
}
</style>