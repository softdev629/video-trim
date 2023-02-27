<template>
  <div class="screen" @mousemove="selectMove($event)" @mouseover="mouseOverFunc($event)" @mouseout="mouseOutFunc($event)"
    :style="`width:100%;height:100%;`" ref="screen">
    <video class="size1" @oncanplay="getDuration()" :src="`/videos/${this.fileName}`"
      :style="`width:600px; height:400px; min-width: 100%; min-height: 100%;`" type="video/mp4" ref="vid"
      @timeupdate="curTimeChange($event)"></video>
    <video style="display:none" :src="`/videos/${this.fileName}`" ref="vid1" type="video/mp4"></video>
    <!-- <div class="text-section" v-if="this.$store.state.set.selectedSettingTool === `text`"
      :style="`width:${this.$store.state.set.textOffsetWidth}px; height:${this.$store.state.set.textOffsetHeight}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.textOffsetLeft}px;top:${this.$store.state.set.textOffsetTop}px; color:${this.$store.state.set.textColor};background-color: transparent; border:solid 0.5px ${this.$store.state.set.textBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)" style="text-align:center">
      {{ this.$store.state.set.textContent }}
      <div class="text-resize" id="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"
        :style="`display:${show}`">
      </div>
  </div> -->

    <div class="shape-section" ref="shape" id="Rectangle"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `Rectangle`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetHeight}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border:solid 5px ${this.$store.state.set.shapeBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section" ref="shape" id="LineToDown"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `LineToDown`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetWidth}px;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border-bottom: 5px solid ${this.$store.state.set.shapeBorderColor};-webkit-transform: translateY(-25px) translateX(15px) rotate(45deg);`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section" ref="shape" id="Circle"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `Circle`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetWidth}px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border:solid 5px ${this.$store.state.set.shapeBorderColor};border-radius:50%`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section" ref="shape" id="Vertical"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `Vertical`"
      :style="`height:${this.$store.state.set.shapeOffsetHeight}px; width:0px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border:solid 5px ${this.$store.state.set.shapeBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section" ref="shape" id="LineToUp"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `LineToUp`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:${this.$store.state.set.shapeOffsetWidth}px;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border-bottom: 5px solid ${this.$store.state.set.shapeBorderColor};-webkit-transform: translateY(13px) translateX(15px) rotate(135deg);`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>
    <div class="shape-section" ref="shape" id="Horizontal"
      v-if="this.$store.state.set.selectedSettingTool === `shape` && this.$store.state.set.shapeContent === `Horizontal`"
      :style="`width:${this.$store.state.set.shapeOffsetWidth}px; height:0px;display:absolute;z-index:10;position:absolute; left:${this.$store.state.set.shapeOffsetLeft + this.spaceLeft}px;top:${this.$store.state.set.shapeOffsetTop + this.spaceTop}px; background-color: transparent; border:solid 5px ${this.$store.state.set.shapeBorderColor};`"
      @mousedown="selectText($event)" @mouseup="selectRelease($event)">
      <div class="text-resize" @mousedown="selectResizeText($event)" @mouseup="selectRelease($event)"></div>
    </div>

  </div>
</template>

<script >
import { useStore } from "vuex";
import setStore from "../store/modules/set.module";
import { useRouter, useRoute } from 'vue-router'
export default {
  name: "ScreenPanel",
  data() {
    return {
      panelWidth: 600,
      panelHeight: 400,
      duration: { mm: 0, ss: 0, ss1: 0 },
      startPos: {
        x: 0,
        y: 0
      },
      fileName: "",
      selectState: 0,
      show: 'none',
      screenWidth: 0,
      screenHeight: 0,
      spaceLeft: 0,
      spaceTop: 0
    };
  },
  mounted() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();



    if (!this.$store.state.set.fileName) {
      router.push('/');
    }

    this.fileName = this.$store.state.set.fileName;


    //    console.log(this.$refs.vid, this.$refs.screen);


    if ((this.$refs.vid.offsetWidth - 40) * this.$store.state.set.screenRate > (this.$refs.vid.offsetHeight - 40)) {
      this.screenHeight = this.$refs.vid.offsetHeight - 40;
      this.screenWidth = (this.screenHeight) / this.$store.state.set.screenRate;
    }
    else {
      this.screenWidth = this.$refs.vid.offsetWidth - 40;
      this.screenHeight = (this.screenWidth) * this.$store.state.set.screenRate;
    }

    this.spaceLeft = Math.trunc((this.$refs.vid.offsetWidth - this.screenWidth) / 2);
    this.spaceTop = Math.trunc((this.$refs.vid.offsetHeight - this.screenHeight) / 2);

    console.log(this.$refs.vid.offsetWidth, this.screenWidth, this.spaceLeft, "!!!!!!!!!!!!!!!!!!!!!!!");



    //screenwidth, screenheight, offsetx, offsety
    this.$store.dispatch('setData', {
      type: 'screenWidth',
      value: this.screenWidth
    });

    this.$store.dispatch('setData', {
      type: 'screenHeight',
      value: this.screenHeight
    });

    //    console.log(this.spaceTop, this.spaceLeft);

    this.$store.dispatch('setData', {
      type: 'shapeOffsetLeft',
      value: 100
    });

    this.$store.dispatch('setData', {
      type: 'shapeOffsetTop',
      value: 100
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
      const makeSureInRange = (x, l, r) => {
        if (x < l) return l;
        if (x > r) return r;
        return x;
      };
      if (this.selectState == 0)
        return;

      console.log("total width = ", this.$store.state.set.windowOuterWidth, "screenwidth = ", this.$refs.screen.offsetWidth, "space = ", this.spaceLeft);
      let leftFrom = this.spaceLeft + this.$store.state.set.windowOuterWidth - this.$refs.screen.offsetWidth;
      let leftTo = this.$store.state.set.windowOuterWidth - this.spaceLeft;

      let topFrom = this.spaceTop;
      let topTo = this.$refs.screen.offsetHeight - this.spaceTop;

      let oldx = makeSureInRange(this.startPos.x, leftFrom, leftTo);
      let oldy = makeSureInRange(this.startPos.y, topFrom, topTo);

      let newx = makeSureInRange(e.x, leftFrom, leftTo);
      let newy = makeSureInRange(e.y, topFrom, topTo);

      let offsetX = newx - oldx;
      let offsetY = newy - oldy;

      this.startPos = {
        x: newx,
        y: newy
      }




      if ((this.$refs.vid.offsetWidth - 40) * this.$store.state.set.screenRate > (this.$refs.vid.offsetHeight - 40)) {
        this.screenHeight = this.$refs.vid.offsetHeight - 40;
        this.screenWidth = (this.screenHeight) / this.$store.state.set.screenRate;
      }
      else {
        this.screenWidth = this.$refs.vid.offsetWidth - 40;
        this.screenHeight = (this.screenWidth) * this.$store.state.set.screenRate;
      }

      this.spaceLeft = Math.trunc((this.$refs.vid.offsetWidth - this.screenWidth) / 2);
      this.spaceTop = Math.trunc((this.$refs.vid.offsetHeight - this.screenHeight) / 2);


      console.log("(this.$store.state.set.shapeOffsetTop > this.$store.state.set.screenHeight - this.$refs.shape.offsetHeight");


      //screenwidth, screenheight, offsetx, offsety
      this.$store.dispatch('setData', {
        type: 'screenWidth',
        value: this.screenWidth
      });

      this.$store.dispatch('setData', {
        type: 'shapeOffsetLeft',
        value: this.screenHeight
      });

      this.$store.dispatch('setData', {
        type: 'shapeOffsetLeft',
        value: this.$refs.shape.offsetLeft - this.spaceLeft
      });

      this.$store.dispatch('setData', {
        type: 'shapeOffsetTop',
        value: this.$refs.shape.offsetTop - this.spaceTop
      });










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
        /*
                let newLeft = Math.max(Math.min(this.$store.state.set.shapeOffsetLeft, this.$store.state.set.screenWidth - this.$refs.shape.offsetWidth), 0);
                let newTop = Math.max(Math.min(this.$store.state.set.shapeOffsetTop, this.$store.state.set.screenHeight - this.$refs.shape.offsetHeight), 0);
                this.$store.dispatch('setData', {
                    type: 'shapeOffsetLeft',
                    value: newLeft
                });
                this.$store.dispatch('setData', {
                    type: 'shapeOffsetTop',
                    value: newTop
                });
        */
        /*
                if (this.$store.state.set.shapeOffsetLeft < 0) {
                  //          console.log("this.$store.state.set.shapeOffsetLeft < 0");
        
        
                  this.$store.dispatch('setData', {
                    type: 'shapeOffsetLeft',
                    value: this.$store.state.set.shapeOffsetLeft + 5
                  });
                  this.selectState = 0;
                  return;
                }
        
                if (this.$store.state.set.shapeOffsetLeft > this.$store.state.set.screenWidth - this.$refs.shape.offsetWidth) {
                  //          console.log("this.$store.state.set.shapeOffsetLeft > this.$store.state.set.screenWidth - this.$refs.shape.offsetWidth");
        
        
                  this.$store.dispatch('setData', {
                    type: 'shapeOffsetLeft',
                    value: this.$store.state.set.shapeOffsetLeft - 5
                  });
                  this.selectState = 0;
                  return;
                }
        
        
                if (this.$store.state.set.shapeOffsetTop < 0) {
                  //          console.log("this.$store.state.set.shapeOffsetTop < 0");
        
        
                  this.$store.dispatch('setData', {
                    type: 'shapeOffsetTop',
                    value: this.$store.state.set.shapeOffsetTop + 5
                  });
                  this.selectState = 0;
                  return;
                }
        
        
                if (this.$store.state.set.shapeOffsetTop > this.$store.state.set.screenHeight - this.$refs.shape.offsetHeight) {
                  //          console.log("(this.$store.state.set.shapeOffsetTop > this.$store.state.set.screenHeight - this.$refs.shape.offsetHeight", this.$store.state.set.shapeOffsetTop, this.$store.state.set.screenHeight, this.$store.state.set.screenWidth, this.$refs.shape.offsetHeight, this.$refs.shape.offsetWidth);
        
        
                  this.$store.dispatch('setData', {
                    type: 'shapeOffsetTop',
                    value: this.$store.state.set.shapeOffsetTop - 5
                  });
                  this.selectState = 0;
                  return;
                }
        */




        console.log(this.$store.state.set.shapeOffsetLeft, this.$store.state.set.shapeOffsetTop, this.$refs.vid.offsetWidth, this.$refs.vid.offsetHeight, this.$store.state.set.screenRate, this.screenWidth, this.screenHeight, this.spaceLeft, this.spaceTop, offsetX);


        if (this.$store.state.set.selectedSettingTool === 'shape' && this.$store.state.set.shapeContent === 'Rectangle') {

          if (this.selectState == 1) {
            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.$store.state.set.shapeOffsetLeft + offsetX
            });

            console.log(this.$store.state.set.shapeOffsetLeft);

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
        else if (this.$store.state.set.selectedSettingTool === 'shape' && this.$store.state.set.shapeContent === 'Circle') {

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
        else if (this.$store.state.set.selectedSettingTool === 'shape') {

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
        ss: parseInt(((currentTime * 100) % 6000) / 100),
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
          ss: parseInt(((currentTime * 100) % 6000) / 100),
          ss1: parseInt((currentTime * 100) % 100),
        },
      });
    },
  },
  watch: {
    "$store.state.set.isPlay": function (val, oldVal) {
      if (this.$store.state.set.isPlay) {
        this.$refs.vid1.play();
      }
      else {
        this.$refs.vid1.pause();
      }

    },
    "$store.state.set.curTime": function (val, oldVal) {
      if (val === oldVal) return;
      const currentTime = this.$refs.vid.currentTime;
      const compare = {
        mm: parseInt((currentTime * 100) / (100 * 60)),
        ss: parseInt(((currentTime * 100) % 6000) / 100),
        ss1: parseInt((currentTime * 100) % 100),
      };

      if (
        compare.mm === this.$store.state.set.curTime.mm &&
        compare.ss === this.$store.state.set.curTime.ss &&
        compare.ss1 === this.$store.state.set.curTime.ss1
      )
        return;

      this.$refs.vid.currentTime = (val.mm * 100 * 60 + val.ss * 100 + val.ss1) / 100;
      //      this.$refs.vid1.currentTime = (val.mm * 100 * 60 + val.ss * 100 + val.ss1) / 100;
    },
    "$store.state.set.fileName": function (val, oldVal) {
      this.fileName = this.$store.state.set.fileName;
    },
    "$store.state.set.selectedSettingTool": function (val, oldVal) {

      //shape-section

      if (this.$store.state.set.selectedSettingTool !== "shape")
        return;



      if ((this.$refs.vid.offsetWidth - 40) * this.$store.state.set.screenRate > (this.$refs.vid.offsetHeight - 40)) {
        this.screenHeight = this.$refs.vid.offsetHeight - 40;
        this.screenWidth = (this.screenHeight) / this.$store.state.set.screenRate;
      }
      else {
        this.screenWidth = this.$refs.vid.offsetWidth - 40;
        this.screenHeight = (this.screenWidth) * this.$store.state.set.screenRate;
      }

      this.spaceLeft = Math.trunc((this.$refs.vid.offsetWidth - this.screenWidth) / 2);
      this.spaceTop = Math.trunc((this.$refs.vid.offsetHeight - this.screenHeight) / 2);

      /* 
            console.log("(this.$store.state.set.shapeOffsetTop > this.$store.state.set.screenHeight - this.$refs.shape.offsetHeight");
      
      
            //screenwidth, screenheight, offsetx, offsety
            this.$store.dispatch('setData', {
              type: 'screenWidth',
              value: this.screenWidth
            });
      
            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.screenHeight
            });
      
            this.$store.dispatch('setData', {
              type: 'shapeOffsetLeft',
              value: this.$refs.shape.offsetLeft - this.spaceLeft
            });
      
            this.$store.dispatch('setData', {
              type: 'shapeOffsetTop',
              value: this.$refs.shape.offsetTop - this.spaceTop
            });
      */

    },

  },


};
</script>

<style scoped>
.screen {
  display: flex;
  justify-content: center;
  background-color: rgb(48, 48, 48);
  position: relative;
}

.size1 {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: absolute;
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

.shape-section {
  position: absolute;
}
</style>