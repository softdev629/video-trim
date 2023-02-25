<template>
  <div class="text-bar media-line"
    :style="`position:relative; width: ${100 * (3600 * 100) / (100 * (this.zoom - 6) * (-1)) + 80}px`"
    @mousemove="resizeMoved($event)" @mouseup="resizeReleased($event)">
    <div style="margin-right: 10px; width:70px;margin-top:10px;">
      <i class="fa fa-file-text fa-1x"></i>
    </div>

    <div v-if="this.$store.state.set.selectedSettingTool === `text`" v-for="(text, id) in this.$store.state.upload.texts"
      :key="id" :class="`div-range ${this.active[id]}`"
      :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;`">
      <div class="left" @mousedown="resizeSelected($event, 0, id)"></div>
      <div class="text " @click="selectItem(id)" @mousedown="resizeSelected($event, 2, id)">{{
        text.value.textContent
      }}
      </div>
      <div class="right" @mousedown="resizeSelected($event, 1, id)" :style="`left: ${this.width[id] - 10}px`"></div>
    </div>
    <div v-if="this.$store.state.set.selectedSettingTool !== `text`" v-for="(text, id) in this.$store.state.upload.texts"
      :key="id" class="div-range" :style="`left: ${this.start[id] + 80}px; width:${this.width[id]}px;`">
      <div class="left"></div>
      <div class="text">{{ text.value.textContent }}</div>
      <div class="right" :style="`left: ${this.width[id] - 7}px`"></div>
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
      start: [],
      width: [],
      resizeStart: 0,
      resizeState: false,
      resizeType: 0,
      resizeId: 0,
      active: []
    };
  },
  mounted() {
    var start = [], width = [], active = [];


    for (var i = 0; i < this.$store.state.upload.texts.length; i++) {
      start.push(100 * (this.$store.state.upload.texts[i].value.textFrom.mm * 6000 + this.$store.state.upload.texts[i].value.textFrom.ss * 100 + this.$store.state.upload.texts[i].value.textFrom.ss1) / (100 * (this.zoom - 6) * (-1)));

      width.push(100 * (this.$store.state.upload.texts[i].value.textTo.mm * 6000 + this.$store.state.upload.texts[i].value.textTo.ss * 100 + this.$store.state.upload.texts[i].value.textTo.ss1 - this.$store.state.upload.texts[i].value.textFrom.mm * 6000 - this.$store.state.upload.texts[i].value.textFrom.ss * 100 - this.$store.state.upload.texts[i].value.textFrom.ss1) / (100 * (this.zoom - 6) * (-1)));

      active.push("inactive");


    }
    this.start = start;
    this.width = width;
    this.active = active;

    window.addEventListener('keydown', this.delText);
  },
  watch: {
    zoom: function (newZoom, oldZoom) {

      this.start = this.start / oldZoom;
      this.width = this.width / oldZoom;
      this.start = this.start * newZoom;
      this.width = this.width * newZoom;
    },
    "$store.state.upload.texts.length": function (newZoom, oldZoom) {
      var start = [], width = [], active = [];


      for (var i = 0; i < this.$store.state.upload.texts.length; i++) {
        start.push(100 * (this.$store.state.upload.texts[i].value.textFrom.mm * 6000 + this.$store.state.upload.texts[i].value.textFrom.ss * 100 + this.$store.state.upload.texts[i].value.textFrom.ss1) / (100 * (this.zoom - 6) * (-1)));

        width.push(100 * (this.$store.state.upload.texts[i].value.textTo.mm * 6000 + this.$store.state.upload.texts[i].value.textTo.ss * 100 + this.$store.state.upload.texts[i].value.textTo.ss1 - this.$store.state.upload.texts[i].value.textFrom.mm * 6000 - this.$store.state.upload.texts[i].value.textFrom.ss * 100 - this.$store.state.upload.texts[i].value.textFrom.ss1) / (100 * (this.zoom - 6) * (-1)));

        active.push("inactive");
      }
      this.start = start;
      this.width = width;
      this.active = active;

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
    delText(event) {
      //      alert(event.which);
      if (event.which !== 46)
        return;
      var id = 0, flag = 0;
      for (var i = 0; i < this.active.length; i++) {
        if (this.active[i] === "active") {
          id = i; flag = 1;
          break;
        }
      }

      if (!flag)
        return;

      if (this.$store.state.set.selectedSettingTool !== "text")
        return;

      if (this.active[id] !== "active")
        return;

      var texts = this.$store.state.upload.texts;
//      console.log("id,  length", id, this.active.length);

      var payload;

      if (id == this.active.length - 1) {
        if (id == 0) {
          payload = {
            type: "textFrom", value: {
              mm: 0,
              ss: 0,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "textTo", value: {
              mm: 0,
              ss: 5,
              ss1: 0,
            }
          };
          this.$store.dispatch("setData", payload);
        }
        else {
          payload = {
            type: "textFrom", value: {
              mm: this.$store.state.upload.texts[id - 1].value.textFrom.mm,
              ss: this.$store.state.upload.texts[id - 1].value.textFrom.ss,
              ss1: this.$store.state.upload.texts[id - 1].value.textFrom.ss1,
            }
          };
          this.$store.dispatch("setData", payload);



          payload = {
            type: "textTo", value: {
              mm: this.$store.state.upload.texts[id - 1].value.textTo.mm,
              ss: this.$store.state.upload.texts[id - 1].value.textTo.ss,
              ss1: this.$store.state.upload.texts[id - 1].value.textTo.ss1,
            }
          };
          this.$store.dispatch("setData", payload);
        }

      }


      texts.splice(id, 1);

      payload = { type: "texts", value: texts };


      this.$store.dispatch("updateToUploadDatas", payload);

    },
    selectItem(id) {
      for (var i = 0; i < this.active.length; i++) {
        this.active[i] = "inactive";
      }
      this.active[id] = "active";
    },
    resizeSelected(e, type, id) {

      this.resizeState = true;
      this.resizeType = type;
      this.resizeStart = e.x;
      this.resizeId = id;
    },
    resizeMoved(e) {
      if (this.$store.state.set.selectedSettingTool !== 'text')
        return;

      const timeToObject = value => {
        return {
          mm: Math.trunc(value / 6000),
          ss: Math.trunc((value % 6000) / 100),
          ss1: Math.trunc((value % 6000) % 100)
        }
      }

      const pixelToTime = pixel => {
        return parseInt(((pixel / 100) * 100) * ((-1) * (this.zoom - 6)));
      }

      const update = (type, value, index) => {
        var texts = this.$store.state.upload.texts;

        var time = pixelToTime(value);

        var timeObject = timeToObject(time);

        if (type == "textFrom") {
          texts[index].value.textFrom.mm = timeObject.mm;
          texts[index].value.textFrom.ss = timeObject.ss;
          texts[index].value.textFrom.ss1 = timeObject.ss1;
        }
        else if (type == "textTo") {
          texts[index].value.textTo.mm = timeObject.mm;
          texts[index].value.textTo.ss = timeObject.ss;
          texts[index].value.textTo.ss1 = timeObject.ss1;
        }

        var payload = { type: "texts", value: texts };


        this.$store.dispatch("updateToUploadDatas", payload);


      }


      if (this.resizeState == true) {//right
        if (this.resizeType == 1) {
          //check conflict
          if (this.resizeId + 1 != this.width.length) {



            if (this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart >= this.start[this.resizeId + 1]) {


              this.width[this.resizeId] = this.start[this.resizeId + 1] - 1 - this.start[this.resizeId];

              update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);


              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }

          if (this.width[this.resizeId] + e.x - this.resizeStart < 50) {

            this.width[this.resizeId] = 50;

            update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);


            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }


          this.width[this.resizeId] += e.x - this.resizeStart;
          update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);

          if (this.resizeId + 1 == this.width.length) {

            var textFrom = parseInt((((this.start[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
            var textTo = parseInt((((this.start[this.resizeId] + this.width[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));


            var payload = {
              type: "textFrom", value: {
                mm: parseInt((textFrom) / (100 * 60)),
                ss: parseInt(((textFrom) % (100 * 60)) / 100),
                ss1: parseInt(((textFrom) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);
            update("textFrom", this.start[this.resizeId], this.resizeId);


            payload = {
              type: "textTo", value: {
                mm: parseInt((textTo) / (100 * 60)),
                ss: parseInt(((textTo) % (100 * 60)) / 100),
                ss1: parseInt(((textTo) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);

            update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);

          }

        }
        else if (this.resizeType == 0) //left
        {
          //check conflict

          if (this.resizeId != 0) {

            if (this.start[this.resizeId - 1] + this.width[this.resizeId - 1] >= this.start[this.resizeId] + e.x - this.resizeStart) {


              this.start[this.resizeId] = this.width[this.resizeId - 1] + this.start[this.resizeId - 1] + 1;
              update("textFrom", this.start[this.resizeId], this.resizeId);

              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }


          if (this.start[this.resizeId] + e.x - this.resizeStart < 0) {

            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
          if (this.width[this.resizeId] - (e.x - this.resizeStart) < 50) {

            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }


          this.start[this.resizeId] += e.x - this.resizeStart;
          this.width[this.resizeId] -= e.x - this.resizeStart;

          update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);
          update("textFrom", this.start[this.resizeId], this.resizeId);
        }
        else//move s
        {

          //check conflict
          if (this.resizeId + 1 != this.width.length) {

            if (this.start[this.resizeId] + this.width[this.resizeId] + e.x - this.resizeStart >= this.start[this.resizeId + 1] && e.x - this.resizeStart > 0) {


              this.width[this.resizeId] = this.start[this.resizeId + 1] - this.start[this.resizeId] - 1;
              update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);

              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }

          if (this.resizeId != 0) {

            if (this.start[this.resizeId - 1] + this.width[this.resizeId - 1] >= this.start[this.resizeId] + e.x - this.resizeStart) {




              this.start[this.resizeId] = this.start[this.resizeId - 1] + this.width[this.resizeId - 1] + 1;

              update("textFrom", this.start[this.resizeId], this.resizeId);

              this.resizeState = false;
              this.resizeStart = 0;
              return;
            }
          }


          if (this.start[this.resizeId] + e.x - this.resizeStart < 0) {
            this.start[this.resizeId] = 0;
            update("textFrom", this.start[this.resizeId], this.resizeId);


            this.resizeState = false;
            this.resizeStart = 0;
            return;
          }
          this.start[this.resizeId] += e.x - this.resizeStart;
          update("textFrom", this.start[this.resizeId], this.resizeId);


          if (this.resizeId + 1 == this.width.length) {

            var textFrom = parseInt((((this.start[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));
            var textTo = parseInt((((this.start[this.resizeId] + this.width[this.resizeId]) / 100) * 100) * ((-1) * (this.zoom - 6)));


            var payload = {
              type: "textFrom", value: {
                mm: parseInt((textFrom) / (100 * 60)),
                ss: parseInt(((textFrom) % (100 * 60)) / 100),
                ss1: parseInt(((textFrom) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);
            update("textFrom", this.start[this.resizeId], this.resizeId);

            payload = {
              type: "textTo", value: {
                mm: parseInt((textTo) / (100 * 60)),
                ss: parseInt(((textTo) % (100 * 60)) / 100),
                ss1: parseInt(((textTo) % (100 * 60)) % 100),
              }
            };
            this.$store.dispatch("setData", payload);
            update("textTo", this.width[this.resizeId] + this.start[this.resizeId], this.resizeId);


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
  height: 28px;
  position: absolute;
  left: 0px;
  text-indent: 0px;
  background-color: rgb(244, 162, 30);
  margin: 3px 0px;
  border-radius: 5px;
}

.left {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  /* border: none; */
  border-left: solid 2px rgba(255, 255, 255, 0.6);
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 3px;
  width: 6px;
  z-index: 5;
}


.text {
  text-align: center;
  position: relative;
  overflow: hidden;
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


.text-bar {
  background-color: rgb(20, 20, 20);
  color: #FFFFFF;
  margin-top: 10px;
}

.text-bar:hover {
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
