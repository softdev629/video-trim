

<template>
  <div
    :style="`background-color: ${bkColor};width:${this.$store.state.set.windowOuterWidth - 1}px; height:5px; position:relative`"
    @mousemove="moveSizeController($event)" @mousedown="selectSizeController($event)" @mouseup="selectRelease($event)"
    @mouseover="changeBkColor($event)" @mouseout="rechangeBkColor($event)">
    <!-- <p style="position:relative;width:20px;top:-320%;left: 650px;color:rgb(16,16,16)">...</p> -->
  </div>
</template>

<script >
import { useStore } from "vuex";
import setStore from '../store/modules/set.module';
export default {
  name: 'ScreenSizeXController',
  data() {
    return {
      width: 0,
      height: 450,
      bkColor: 'rgb(48, 48, 48)',
      selectState: 0,
      startPos: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    const store = useStore();

    this.width = this.$store.state.set.windowOuterWidth;
    this.height = setStore.state.screenYControllerWidth;



  },
  methods: {
    selectSizeController: function (e) {


      this.selectState = 1;

      this.startPos = {
        x: e.x,
        y: e.y
      }
    },
    moveSizeController: function (e) {
      return;
      if (this.selectState == 1) {
        let offsetX = e.x - this.startPos.x;
        let offsetY = e.y - this.startPos.y;

        this.startPos = {
          x: e.x,
          y: e.y
        }




        var panelHeight = this.$store.state.set.panelHeight;
        var workingPanelHeight = this.$store.state.set.workingPanelHeight;
        this.$store.dispatch('setData', {
          type: 'panelHeight',
          value: panelHeight + offsetY
        });

        this.$store.dispatch('setData', {
          type: 'workingPanelHeight',
          value: workingPanelHeight - offsetY
        });

      }

    },
    selectRelease: function (e) {
      this.selectState = 0;
    },
    changeBkColor: function (e) {
      this.bkColor = '#0d6efd';
    },
    rechangeBkColor: function (e) {
      this.bkColor = 'rgb(48, 48, 48)';
    },
  }
}
</script>
<style scoped>
.screenY {
  width: 5px;
  height: auto;
  color: solid 2px rgb(16, 16, 16);
  ;
}

.screenX {
  width: 100%;
  height: 10px;
  color: solid 2px rgb(48, 48, 48);
}

.screenX:hover,
.screenY:hover {
  color: solid 2px rgba(46, 167, 197, 0.8) !important;
}
</style>