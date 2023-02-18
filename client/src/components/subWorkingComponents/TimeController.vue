<template>
  <div class="tControl">
    <label style="font-weight:bold">{{ this.$store.state.set.curTime.mm }}&nbsp;:&nbsp;{{
      this.$store.state.set.curTime.ss
    }}&nbsp;,&nbsp;{{
  this.$store.state.set.curTime.ss1
}}</label>&nbsp;&nbsp;/&nbsp;&nbsp;<label>{{ this.$store.state.set.duration.mm }}&nbsp;:&nbsp;{{ this.$store.state.set.duration.ss }}&nbsp;,&nbsp;{{ this.$store.state.set.duration.ss1 }}</label>
  </div>
</template>

<script>
import Timepicker from "vue3-timepicker";
import { useStore } from "vuex";

export default {
  name: "TimeController",
};
</script>
<style scoped>
.tControl {
  margin-left: 20px;
  border: solid 1px rgb(16, 16, 16);
  width: 200px;
  background-color: rgb(16, 16, 16);
  color: white;
  padding: 0px 10px;
  border-radius: 10px;
}

.tControl input {
  border: none;
  width: 25px;
  background-color: rgb(16, 16, 16);
  color: white;
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
</style>
