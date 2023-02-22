<template>
  <div class="shape-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:10px;">
      <i class="fa fa-braille fa-1x"></i>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool === `shape`"
      v-for="(shape, id) in this.$store.state.upload.shapes" :key="id" class="div-range active"
      :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;height:28px;position:absolute`">
      <div class="left" @mousedown="resizeSelected($event, 0, id)"></div>
      <div class="text" @mousedown="resizeSelected($event, 2, id)">{{ shape.value.shapeContent }}</div>
      <div class="right" @mousedown="resizeSelected($event, 1, id)" :style="`left: ${this.width[id] - 10}px`"></div>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool !== `shape`"
      v-for="(shape, id) in this.$store.state.upload.shapes" :key="id" class="div-range"
      :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;height:28px;position:absolute`">
      <div class="left"></div>
      <div class="text">{{ shape.value.shapeContent }}</div>
      <div class="right" :style="`left: ${this.width[id] - 7}px`"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: "ShapeBar",
  props: {
    zoom: Number,
  },
  data() {
    return {
      start: [],
      width: [],
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
      resizeId: 0
    };
  },
  mounted() {
    var start = [], width = [];


    for (var i = 0; i < this.$store.state.upload.shapes.length; i++) {
      start.push(100 * (this.$store.state.upload.shapes[i].value.shapeFrom.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeFrom.ss * 100 + this.$store.state.upload.shapes[i].value.shapeFrom.ss1) / (100 * (this.zoom - 6) * (-1)));
      console.log("each start ", i, start[i]);
      width.push(100 * (this.$store.state.upload.shapes[i].value.shapeTo.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeTo.ss * 100 + this.$store.state.upload.shapes[i].value.shapeTo.ss1 - this.$store.state.upload.shapes[i].value.shapeFrom.mm * 6000 - this.$store.state.upload.shapes[i].value.shapeFrom.ss * 100 - this.$store.state.upload.shapes[i].value.shapeFrom.ss1) / (100 * (this.zoom - 6) * (-1)));
      console.log("each  width", i, width[i]);



    }
    this.start = start;
    this.width = width;



  },
  watch: {
    zoom: function (newZoom, oldZoom) {

      this.start = this.start / oldZoom;
      this.width = this.width / oldZoom;
      this.start = this.start * newZoom;
      this.width = this.width * newZoom;
    },
    "$store.state.upload.shapes.length": function (newZoom, oldZoom) {
      var start = [], width = [];

      console.log("I am a watch, -----------------shapebar.vue 59-----------------");
      for (var i = 0; i < this.$store.state.upload.shapes.length; i++) {
        start.push(100 * (this.$store.state.upload.shapes[i].value.shapeFrom.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeFrom.ss * 100 + this.$store.state.upload.shapes[i].value.shapeFrom.ss1) / (100 * (this.zoom - 6) * (-1)));
        console.log("each start width", i, start[i]);
        width.push(100 * (this.$store.state.upload.shapes[i].value.shapeTo.mm * 6000 + this.$store.state.upload.shapes[i].value.shapeTo.ss * 100 + this.$store.state.upload.shapes[i].value.shapeTo.ss1 - this.$store.state.upload.shapes[i].value.shapeFrom.mm * 6000 - this.$store.state.upload.shapes[i].value.shapeFrom.ss * 100 - this.$store.state.upload.shapes[i].value.shapeFrom.ss1) / (100 * (this.zoom - 6) * (-1)));
        console.log("each start width", i, width[i]);

      }
      this.start = start;
      this.width = width;
      console.log(this.$store.state.upload.shapes, 'this.$store.state.upload.shapes', this.width);
    },
  },
  methods: {
    popup(e) {
      e.preventDefault();
      // if (e.target.tagName == "DIV") {
      //   e.target.children[0].classList.toggle("show");
      // }
      // else if (e.target.tagName == "SPAN") {
      //   e.target.classList.toggle("show");
      // }
    },
    resizeSelected(e, type, id) {

      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;
      this.resizeId = id;
    },
    resizeMoved(e) {
      if (this.$store.state.set.selectedSettingTool !== 'shape')
        return;


      console.log(this.resizeId, 'resizeMoved');
      if (this.resizeState == true) {//right
        if (this.resizeType == 1) {
          //check conflict
          if (this.resizeId + 1 != this.width.length) {

            console.log('----------1111----------------', this.start[this.resizeId], this.width[this.resizeId], e.x, this.resizeStart, this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart, this.start[this.resizeId + 1]);

            if (this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart >= this.start[this.resizeId + 1]) {
              console.log('----------2222----------------');


              this.width[this.resizeId] = this.start[this.resizeId + 1] - 1 - this.start[this.resizeId];


              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }
          console.log('----------3333----------------', this.width[this.resizeId], e.x, this.resizeStart, this.width[this.resizeId] + e.x - this.resizeStart);
          if (this.width[this.resizeId] + e.x - this.resizeStart < 50) {

            this.width[this.resizeId] = 50;

            console.log('----------4444----------------');
            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }

          console.log('----------5555----------------');
          this.width[this.resizeId] += e.x - this.resizeStart;
          if (this.resizeId + 1 == this.width.length) {
            console.log('----------6666----------------');
            var shapeFrom = parseInt((((this.start[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
            var shapeTo = parseInt((((this.start[this.resizeId] + this.width[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
            console.log('----------7777----------------');

            var payload = {
              type: "shapeFrom", value: {
                mm: parseInt((shapeFrom) / (100 * 60)),
                ss: parseInt(((shapeFrom) % (100 * 60)) / 100),
                ss1: parseInt(((shapeFrom) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);

            payload = {
              type: "shapeTo", value: {
                mm: parseInt((shapeTo) / (100 * 60)),
                ss: parseInt(((shapeTo) % (100 * 60)) / 100),
                ss1: parseInt(((shapeTo) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);

          }

        }
        else if (this.resizeType == 0) //left
        {
          //check conflict
          console.log('----------8888----------------', this.resizeId);
          if (this.resizeId != 0) {
            console.log('----------9999----------------', this.start[this.resizeId - 1] + this.width[this.resizeId - 1], this.start[this.resizeId] - e.x + this.resizeStart);
            if (this.start[this.resizeId - 1] + this.width[this.resizeId - 1] >= this.start[this.resizeId] + e.x - this.resizeStart) {
              console.log('----------aaaa----------------', this.start[this.resizeId - 1], this.width[this.resizeId - 1], this.start[this.resizeId], e.x, this.resizeStart, this.start[this.resizeId - 1] + this.width[this.resizeId - 1], this.start[this.resizeId] - e.x + this.resizeStart);

              this.start[this.resizeId] = this.width[this.resizeId - 1] + this.start[this.resizeId - 1] + 1;


              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }


          if (this.start[this.resizeId] + e.x - this.resizeStart < 0) {
            console.log('----------bbbb----------------', this.start[this.resizeId], e.x - this.resizeStart);
            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
          if (this.width[this.resizeId] - (e.x - this.resizeStart) < 50) {
            console.log('----------cccc----------------', this.width[this.resizeId], e.x - this.resizeStart);
            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }

          console.log('----------dddd----------------');
          this.start[this.resizeId] += e.x - this.resizeStart;
          this.width[this.resizeId] -= e.x - this.resizeStart;
        }
        else//move s
        {
          console.log('----------eeee----------------');
          //check conflict
          if (this.resizeId + 1 != this.width.length) {
            console.log('----------ffff----------------');
            if (this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart >= this.start[this.resizeId + 1] && e.x - this.resizeStart > 0) {
              console.log('----------gggg----------------');

              this.width[this.resizeId] = this.start[this.resizeId + 1] - this.start[this.resizeId] - 1;

              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }

          if (this.resizeId != 0) {
            console.log('----------hhhh----------------');
            if (this.start[this.resizeId - 1] + this.width[this.resizeId - 1] >= this.start[this.resizeId] + e.x - this.resizeStart) {
              console.log('----------iiii----------------', this.start[this.resizeId], this.start[this.resizeId - 1], this.width[this.resizeId], 1);
              this.start[this.resizeId] = this.start[this.resizeId - 1] + this.width[this.resizeId - 1] + 1;

              console.log('----------iiii----------------');
              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }


          if (this.start[this.resizeId] + e.x - this.resizeStart < 0) {
            this.start[this.resizeId] = 0;
            console.log('----------jjjj----------------');
            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
          this.start[this.resizeId] += e.x - this.resizeStart;
          console.log(this.start[this.resizeId], 'this.start[this.resizeId]');

          if (this.resizeId + 1 == this.width.length) {
            console.log('----------kkkk----------------');
            var shapeFrom = parseInt((((this.start[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
            var shapeTo = parseInt((((this.start[this.resizeId] + this.width[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));

            console.log('----------llll----------------');
            var payload = {
              type: "shapeFrom", value: {
                mm: parseInt((shapeFrom) / (100 * 60)),
                ss: parseInt(((shapeFrom) % (100 * 60)) / 100),
                ss1: parseInt(((shapeFrom) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);

            payload = {
              type: "shapeTo", value: {
                mm: parseInt((shapeTo) / (100 * 60)),
                ss: parseInt(((shapeTo) % (100 * 60)) / 100),
                ss1: parseInt(((shapeTo) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);
            console.log('----------mmmm----------------');
          }

        }

        this.resizeStart = e.x;
      }
    },
    resizeReleased(e) {
      this.resizeState = false;
      this.resizeStart = 0;
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
  text-indent: 0px;
  background-color: rgb(46, 185, 66);
  margin: 3px 0px;
  border-radius: 5px;
  z-index: 2;
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
  z-index: 5;
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
  z-index: 5;
}


.shape-bar {
  background-color: rgb(20, 20, 20);
  color: #FFFFFF;
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

.popup-div {
  position: absolute;

}


/* Popup container - can be anything you want */
.popup {
  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* The actual popup */
.popup .popuptext {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}

/* Popup arrow */
.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
