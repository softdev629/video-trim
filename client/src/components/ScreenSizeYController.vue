<template>
  <div class="screenY"
    :style="`background-color: ${bkColor};width:${this.$store.state.set.screenYControllerWidth}px; height:${this.$store.state.set.screenHeight}px; position:relative`"
    @mousemove="moveSizeController($event)" @mousedown="selectSizeController($event)" @mouseup="selectRelease($event)"
    @mouseover="changeBkColor($event)" @mouseout="rechangeBkColor($event)">
    <!-- <div :style="`position:relative;top:40%;left:-100%;`">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em"
        xmlns="http://www.w3.org/2000/svg" :style="`vertical-align: middle;color:rgba(0, 0, 0, 0.8) ;`">
        <path d="M10 10h4v4h-4zm0-6h4v4h-4zm0 12h4v4h-4z"></path>
      </svg>
    </div> -->
  </div>
</template>

<script >
import { useStore } from "vuex";
import setStore from '../store/modules/set.module';
export default {
  name: 'ScreenSizeYController',
  data() {
    return {
      width: 0,
      height: 450,
      bkColor: 'rgb(16,16,16)',
      bkColor1: 'rgb(48, 48, 48)',
      selectState: 0,
      startPos: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    const store = useStore();
    this.width = setStore.state.screenYControllerWidth;
    this.height = setStore.state.screenHeight;
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
      let offsetX = e.x - this.startPos.x;
      let offsetY = e.y - this.startPos.y;

      this.startPos = {
        x: e.x,
        y: e.y
      }


      if (this.selectState == 1) {
        var settingBoxWidth = this.$store.state.set.settingBoxWidth;
        var panelWidth = this.$store.state.set.panelWidth;

        this.$store.dispatch('setData', {
          type: 'settingBoxWidth',
          value: settingBoxWidth + offsetX
        });

        this.$store.dispatch('setData', {
          type: 'panelWidth',
          value: panelWidth - offsetX
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