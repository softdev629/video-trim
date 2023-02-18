<template>
  <div class="tool-setting-panel">
    <Tools @forceRendering="forceRender()" />
    <SettingPanel />
    <ScreenSizeYController @forceRendering="forceRender()" />
  </div>
</template>

<script >
import Tools from './Tools.vue';
import ScreenSizeYController from './ScreenSizeYController.vue';
import SettingPanel from './SettingPanel.vue';
import { onMounted } from 'vue';

export default {
  name: 'ToolSettingPanel',
  components: {
    Tools,
    SettingPanel,
    ScreenSizeYController
  },
  emits: ["forceRendering"],
  mounted() {

  },
  methods: {
    forceRender: function () {

      this.$emit('forceRendering');
    }
  }
}
</script>

<style scoped>
.tool-setting-header {
  text-align: left;
}
</style>