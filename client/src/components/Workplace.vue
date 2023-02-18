<template>
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