<template>
  <div style="margin: 0px 20px" class="tControl">
    <input type="number" v-model="this.tData.mm" @change="to_props()" min="0" max="60" default="0" />:
    <input type="number" v-model="this.tData.ss" @change="to_props()" min="0" max="99" default="0" />:
    <input type="number" v-model="this.tData.ss1" @change="to_props()" min="0" max="99" default="0" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import setStore from "../../store/modules/set.module";

export default {
  name: 'TimePicker',
  emits: ["timeChange"],
  props: { timeData: String },
  data() {
    return {
      tData: {
        mm: 0,
        ss: 0,
        ss1: 0
      }
    }
  },
  mounted() {
    if (this.timeData == 'stimeData') {
      this.tData.mm = setStore.state.from.mm;
      this.tData.ss = setStore.state.from.ss;
      this.tData.ss1 = setStore.state.from.ss1;
    }
    else if (this.timeData == 'etimeData') {
      this.tData.mm = setStore.state.to.mm;
      this.tData.ss = setStore.state.to.ss;
      this.tData.ss1 = setStore.state.to.ss1;
    }

  },
  methods: {
    to_props: function () {

      this.$emit('timeChange', this.timeData.mm, this.timeData.ss, this.timeData.ss1);
    }
  }
}

</script>
<style scoped>
.tControl {
  border: solid 1px rgb(16, 16, 16);
  width: 50px;
  display: flex;
}

.tControl input {
  border: none;
  width: 25px;
}

.tControl input:focus {
  border: none;
}

.tControl input:active {
  border: none;
}

.tControl input:valid {
  border: none;
}

.tControl input:visited {
  border: none;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>