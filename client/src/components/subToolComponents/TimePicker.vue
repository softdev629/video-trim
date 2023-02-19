<template>
  <div style="margin: 0px 20px" class="tControl">
    <input type="number" v-model="tData.mm" @change="to_props()" min="0" max="59" :default="`${tData.mm}`" />:
    <input type="number" v-model="tData.ss" @change="to_props()" min="0" max="59" :default="`${tData.ss}`" />.
    <input type="number" v-model="tData.ss1" @change="to_props()" min="0" max="99" :default="`${tData.ss1}`" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import setStore from "../../store/modules/set.module";

export default {
  name: 'TimePicker',
  emits: ["timeChange"],
  props: { timeData: String, tmm: Number, tss: Number, tss1: Number },
  data() {
    return {
      tData: {
        mm: this.tmm,
        ss: this.tss,
        ss1: this.tss1
      }
    }
  },
  watch: {
    tmm: function (newOne, oldOne) { this.tData.mm = newOne; },
    tss: function (newOne, oldOne) { this.tData.ss = newOne; },
    tss1: function (newOne, oldOne) { this.tData.ss1 = newOne; },
  },
  methods: {
    to_props: function () {
      if (this.timeData == 'stimeData') {

        let value = {
          mm: this.tData.mm, ss: this.tData.ss, ss1: this.tData.ss1
        };

        //to -from > 125
        var diff = 100 * ((this.$store.state.set.videoTo.mm - this.$store.state.set.videoFrom.mm) * 6000 + (this.$store.state.set.videoTo.ss - this.$store.state.set.videoFrom.ss) * 100 + (this.$store.state.set.videoTo.ss1 - this.$store.state.set.videoFrom.ss1)) / (100 * (this.$store.state.set.zoom - 6) * (-1));

        console.log('diff stimedata', diff, this.$store.state.set.zoom);

        if (diff < 125) {
          //set to-from 126
          console.log('diff < 126, timesdata reset');

          var pixel = ((100 * ((this.$store.state.set.videoTo.mm) * 6000 + (this.$store.state.set.videoTo.ss) * 100 + (this.$store.state.set.videoTo.ss1)) / (100 * (this.$store.state.set.zoom - 6) * (-1)))) - 126;

          console.log('pixel', pixel);

          var time = parseInt((pixel) * ((-1) * (this.$store.state.set.zoom - 6)));

          console.log('time', time);
          var prevFrom1 = (this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1);

          var dOffset = prevFrom1 - time;

          this.$store.dispatch("setData", {
            type: "videoFrom",
            value: {
              mm: parseInt((time) / (100 * 60)),
              ss: parseInt(((time) % (100 * 60)) / 100),
              ss1: parseInt(((time) % (100 * 60)) % 100),
            },
          });

          var delay = (this.$store.state.set.delay.mm * 6000 + this.$store.state.set.delay.ss * 100 + this.$store.state.set.delay.ss1);

          console.log(delay, dOffset, 'delay--------offset');


          this.$store.dispatch("setData", {
            type: "delay",
            value: {
              mm: parseInt((delay - dOffset) / (100 * 60)),
              ss: parseInt(((delay - dOffset) % (100 * 60)) / 100),
              ss1: parseInt(((delay - dOffset) % (100 * 60)) % 100),
            },
          });

          console.log(this.$store.state.set.delay, 'store ------ delay');


          return;
        }



        var prevFrom = (this.$store.state.set.videoFrom.mm * 6000 + this.$store.state.set.videoFrom.ss * 100 + this.$store.state.set.videoFrom.ss1);


        var mm = this.$store.state.set.delay.mm + value.mm - this.$store.state.set.videoFrom.mm;
        var ss = this.$store.state.set.delay.ss + value.ss - this.$store.state.set.videoFrom.ss;
        var ss1 = this.$store.state.set.delay.ss1 + value.ss1 - this.$store.state.set.videoFrom.ss1;

        let payload = {
          type: "delay", value: {
            mm: mm,
            ss: ss,
            ss1: ss1
          }
        };

        this.$store.dispatch("setData", payload);

        payload = { type: "videoFrom", value };
        this.$store.dispatch("setData", payload);




      }
      if (this.timeData == 'etimeData') {
        let value = {
          mm: this.tData.mm, ss: this.tData.ss, ss1: this.tData.ss1
        };

        if (this.tData.mm >= this.$store.state.set.to.mm) {
          if (this.tData.mm == this.$store.state.set.to.mm) {
            if (this.tData.ss >= this.$store.state.set.to.ss) {
              if (this.tData.ss == this.$store.state.set.to.ss) {
                if (this.tData.ss >= this.$store.state.set.to.ss) {
                  this.tData.mm = this.$store.state.set.to.mm;
                  this.tData.ss = this.$store.state.set.to.ss;
                  this.tData.ss1 = this.$store.state.set.to.ss1;
                  return;
                }
              }
              else {
                this.tData.mm = this.$store.state.set.to.mm;
                this.tData.ss = this.$store.state.set.to.ss;
                this.tData.ss1 = this.$store.state.set.to.ss1;
                return;
              }
            }
          }
          else {
            this.tData.mm = this.$store.state.set.to.mm;
            this.tData.ss = this.$store.state.set.to.ss;
            this.tData.ss1 = this.$store.state.set.to.ss1;
            return;
          }
        }

        //to - from > 125
        //to -from > 125
        var diff = 100 * ((this.$store.state.set.videoTo.mm - this.$store.state.set.videoFrom.mm) * 6000 + (this.$store.state.set.videoTo.ss - this.$store.state.set.videoFrom.ss) * 100 + (this.$store.state.set.videoTo.ss1 - this.$store.state.set.videoFrom.ss1)) / (100 * (this.$store.state.set.zoom - 6) * (-1))

        console.log('diff etimedata', diff);

        if (diff < 125) {
          this.tData.mm = this.$store.state.set.videoTo.mm;
          this.tData.ss = this.$store.state.set.videoTo.ss;
          this.tData.ss1 = this.$store.state.set.videoTo.ss1;
          return;
        }



        let payload = { type: "videoTo", value };
        this.$store.dispatch("setData", payload);

      }
      if (this.timeData == 'delay') {
        console.log('delay--------------150------');

        let value = {
          mm: this.tData.mm, ss: this.tData.ss, ss1: this.tData.ss1
        };
        let payload = { type: "delay", value };
        this.$store.dispatch("setData", payload);
      }

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