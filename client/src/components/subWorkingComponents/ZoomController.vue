<template>
  <div style="margin-top:10px;"><i class="fa fa-minus-circle"></i>&nbsp;&nbsp;&nbsp;<input type="range" min="1" max="5"
      v-model="stateZoom" @change="this.setZoom(stateZoom)" />&nbsp;&nbsp;&nbsp;<i
      class="fa fa-plus-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
</template>



<script>
export default {
  name: "ZoomController",
  props: {
    zoom: String,
    setZoom: Function,
  },
  data() {
    return {
      stateZoom: 1,
    };
  },
  mounted() {
    this.stateZoom = this.zoom;
  },
};
</script>
<style scoped>
.fa-minus-circle:hover {
  color: rgb(64, 64, 64)
}

.fa-plus-circle:hover {
  color: rgb(64, 64, 64)
}

div {
  margin-top: 20px;
  margin-right: 30px;
}


input[type=range] {
  height: 15px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 150px;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 150px;
  height: 7px;
  cursor: pointer;
  animate: 0.2s;
  background: rgb(64, 64, 64);
  border-radius: 10px;
  border: 1px solid #000000;
}



input[type=range]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #000000;
  border: 1px solid #000000;
  height: 15px;
  width: 15px;
  border-radius: 8px;
  background: rgb(255, 255, 255, 0.95);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}


input[type=range]:focus::-webkit-slider-runnable-track {
  background: rgb(64, 64, 64)
}


input[type=range]::-moz-range-track {
  width: 150px;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 1px 1px 1px #000000;
  background: rgb(64, 64, 64);
  border-radius: 10px;
  border: 1px solid #000000;
}

input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000;
  border: 1px solid #000000;
  height: 30px;
  width: 15px;
  border-radius: 5px;
  background: #FFFFFF;
  cursor: pointer;
}

input[type=range]::-ms-track {
  width: 150px;
  height: 10px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

input[type=range]::-ms-fill-lower {
  background: rgb(64, 64, 64);
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 1px 1px 1px #000000;
}

input[type=range]::-ms-fill-upper {
  background: rgb(64, 64, 64);
  border: 1px solid #000000;
  border-radius: 10px;
  box-shadow: 1px 1px 1px #000000;
}

input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 1px 1px 1px #000000;
  border: 1px solid #000000;
  height: 30px;
  width: 15px;
  border-radius: 5px;
  background: #FFFFFF;
  cursor: pointer;
}

input[type=range]:focus::-ms-fill-lower {
  background: rgb(64, 64, 64);
}

input[type=range]:focus::-ms-fill-upper {
  background: rgb(64, 64, 64);
}
</style>