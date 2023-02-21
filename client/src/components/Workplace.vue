<template>
  <button class="save-btn" @click="trim()"><label class="save-btn-label">Save</label><i
      class="fa fa-upload save-btn-icon"></i></button>
  <div :class="`${this.$store.state.set.loader}`"></div>
  <div :class="`${this.$store.state.set.comment}`" :style="`display:${this.$store.state.set.commentDisplay}`">Saving
    file.&nbsp;&nbsp;&nbsp;Wait a moment...
  </div>
  <div class="container-fluid work-place" :style="`display:${this.$store.state.set.all}`">
    <div class="setting-screen-panel">
      <div class="tool-setting">
        <ToolSettingPanel @forceRendering="forceRendering()" />
      </div>

      <div class="padding-none">
        <ScreenPanel @forceRendering="forceRendering()" />
      </div>
    </div>
    <!-- <div class="row-fluid">
                                                                                                                                                                                              <div class="col-md-12">
                                                                                                                                                                                                <ScreenSizeXController @forceRendering="forceRendering()" />
                                                                                                                                                                                              </div>
                                                                                                                                                                                            </div> -->
    <div class="row-fluid">
      <div class="col-md-12">
        <WorkingPanel @forceRendering="forceRendering()" />
      </div>
    </div>
  </div>
</template>

<script>
import ToolSettingPanel from './ToolSettingPanel.vue';
import ScreenPanel from './ScreenPanel.vue';
import WorkingPanel from './WorkingPanel.vue';
import ScreenSizeXController from './ScreenSizeXController.vue';
import setStore from '../store/modules/set.module';
import SetModule from '../store/modules/set.module.js'
import axios from 'axios'
import { computed } from 'vue';
import { useStore } from "vuex";
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue';

export default {
  name: 'Workplace',
  components: {
    ToolSettingPanel,
    ScreenPanel,
    ScreenSizeXController,
    WorkingPanel
  },
  data() {
    return {
      width: 0
    };
  },
  mounted() {

  },
  created() {

    console.log('mounted');
    var payload = { type: 'windowWidth', value: document.body.offsetWidth };
    this.$store.dispatch('setData', payload);

    payload = { type: 'windowOuterWidth', value: window.outerWidth };
    this.$store.dispatch('setData', payload);


    console.log(document.body.offsetWidth, 'offsetWidth');
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
  },
  methods: {
    func: function () {
      this.width = 3;
      alert(this.width);
    },
    trim: function () {
      var length = parseInt(this.$store.state.set.videoTo.mm) * 60 + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm) * 60 - parseInt(this.$store.state.set.videoFrom.ss);
      var start = "00:" + this.$store.state.set.videoFrom.mm.toString() + ":" + this.$store.state.set.videoFrom.ss.toString();
      var end = "00:" + this.$store.state.set.videoTo.mm.toString() + ":" + this.$store.state.set.videoTo.ss.toString();
      var newStart = "00:" + this.$store.state.set.delay.mm.toString() + ":" + this.$store.state.set.delay.ss.toString();
      //      var newEnd = "00:" + (parseInt(this.$store.state.set.videoTo.mm) + parseInt(this.$store.state.set.delay.mm)).toString() + ":" + (parseInt(this.$store.state.set.videoTo.ss) + parseInt(this.$store.state.set.delay.ss)).toString();
      var newEnd = "00:" + parseInt((parseInt(this.$store.state.set.videoTo.mm * 60) + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm * 60) - parseInt(this.$store.state.set.videoFrom.ss)) / 60).toString() + ":" + parseInt((parseInt(this.$store.state.set.videoTo.mm * 60) + parseInt(this.$store.state.set.videoTo.ss) - parseInt(this.$store.state.set.videoFrom.mm * 60) - parseInt(this.$store.state.set.videoFrom.ss)) % 60).toString();


      var data = {
        "length": length,
        "trim": {
          "start": start,
          "end": end,
          "new_start": newStart,
          "new_end": newEnd
        }
      };

      var data1;
      data1 = { type: 'loader', value: "loader" };
      this.$store.dispatch('setData', data1);

      data1 = { type: 'all', value: "none" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "comment", value: "loading-text" };
      this.$store.dispatch('setData', data1);

      data1 = { type: "commentDisplay", value: "block" };
      this.$store.dispatch('setData', data1);



      console.log(data.length, "data.length");
      console.log(data.trim.start, "data.start");
      console.log(data.trim.end, "data.end");
      console.log(data.trim.new_start, "data.new_start");
      console.log(data.trim.new_end, "data.new_end");

      var fname = this.$store.state.set.fileName;
      axios.post('/api/save/' + fname, data).then(ret => {


        console.log(ret.data.filename);
        var payload = { type: "fileName", value: ret.data.filename };
        this.$store.dispatch("setData", payload);
        console.log(payload);

        payload = { type: "fileCount", value: ret.data.filecount };
        this.$store.dispatch("setData", payload);
        var duration = Number(ret.data.duration) * 100;

        payload = {
          type: "duration", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoTo", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "videoFrom", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "delay", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };

        this.$store.dispatch("setData", payload);
        payload = {
          type: "to", value: {
            mm: parseInt(duration / 6000),
            ss: parseInt((duration % 6000) / 100),
            ss1: parseInt((duration % 6000) % 100),
          }
        };
        this.$store.dispatch("setData", payload);
        payload = {
          type: "curTime", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);


        payload = {
          type: "from", value: {
            mm: 0,
            ss: 0,
            ss1: 0,
          }
        };
        this.$store.dispatch("setData", payload);


        payload = { type: 'comment', value: "none" };
        this.$store.dispatch('setData', payload);


        payload = { type: 'loader', value: "none" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'all', value: "block" };
        this.$store.dispatch('setData', payload);

        payload = { type: 'commentDisplay', value: "none" };
        this.$store.dispatch('setData', payload);



        this.$router.push('/workplace');
      }).catch(function () {
        console.log('FAILURE!!');
      });
    },
    forceRendering: function () {

      var panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + this.$store.state.set.settingBoxWidth + 1);

      if (this.$store.state.set.selectedSettingTool) {
        panelWidth -= 41;
      }


      var panelHeight;
      if (this.$store.state.set.screenHeight / panelWidth < this.$store.state.set.screenRate) {
        panelHeight = this.$store.state.set.screenHeight;
      }
      else {
        panelHeight = panelWidth * this.$store.state.set.screenRate;
      }
      var payload = { type: 'panelHeight', value: panelHeight };
      this.$store.dispatch('setData', payload);

      payload = { type: 'panelWidth', value: panelWidth };
      this.$store.dispatch('setData', payload);

      payload = { type: 'screenYControllerWidth', value: 5 };
      this.$store.dispatch('setData', payload);
    }
  }
}
</script>
<style scoped>
.save-btn {
  position: fixed;
  top: 2px;
  right: 10px;
  margin-left: 20px;
  background: #34eae1;
  border: solid 1px white;
  border-radius: 5px;
}

.save-btn:hover {
  background: rgba(46, 185, 66, 1);
  cursor: pointer;
}

.save-btn-label {
  margin-left: 20px;
  color: black;
  font-weight: bold;
}

.save-btn-icon {
  margin-left: 20px;
  margin-right: 20px;
  color: black;
}


.loader {
  border: 16px solid #f3f3f3;
  /* Light grey */
  border-top: 16px solid #3498db;
  /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: fixed;
  right: 45%;
  top: 300px;

}


.loading-text {
  position: fixed;
  right: 42%;
  top: 450px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }

}
</style>