<template>
  <button class="save-btn"><label class="save-btn-label">Export Project</label><i
      class="fa fa-upload save-btn-icon"></i></button>
  <div class="container-fluid work-place">
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

import { computed } from 'vue';
import { useStore } from "vuex";
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
  setup() {
    const store = useStore();
  },
  methods: {
    func: function () {
      this.width = 3;
      alert(this.width);
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
</style>