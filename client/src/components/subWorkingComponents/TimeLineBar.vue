<template>
  <div class="time-line" @mousemove="curPosChanged($event)" @mousedown="curPosSelected($event)"
    :style="`position:relative; width: ${100*(3600*100)/(100 * (this.zoom - 6) * (-1))+80}px; height: 30px`">
    <div class="start">
      <p class="scale">|</p><span class="ruler-number">0:0</span>
    </div>
    <div v-for="i in parseInt((3600 * 100) / (100 * (this.zoom - 6) * (-1)))"
      :style="`position:absolute; left:${100 * i + 80}px;font-size:12px;display:flex`">
      <p class="scale">|</p><span class="ruler-number">
        <span v-if="parseInt(i * 100 * (this.zoom - 6) * (-1) / (60 * 100)) !== 0">{{ parseInt(i*100*(this.zoom - 6) *
        (-1)
        /
        (60 * 100)) }}</span>:<span>
          {{ parseInt((i * 100 * (this.zoom - 6) * (-1) / (100)) % 60) }}</span><span
          v-if="parseInt(i * 100 * (this.zoom - 6) * (-1) % (100))">.{{ parseInt(i*100*(this.zoom - 6) * (-1) % (100))
          }}</span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeLineBar",
  props: {
    zoom: Number,
    duration: Number,
    curPosChanged: Function,
    curPosSelected: Function,
  },
  mounted() {
    console.log("zoom value:", this.zoom);
  }
};
</script>

<style scoped>
.start {
  position: absolute;
  left: 80px;
  font-size: 12px;
  display: flex;
}

.end {
  position: absolute;
}

.time-line {
  background-color: rgb(16, 16, 16);
  color: white;
  cursor: pointer
}

.scale {
  color: rgb(150, 150, 150);
  margin-bottom: 0px;
  font-size: 15px;
}

.ruler-number {
  margin-top: 5px;
}
</style>
