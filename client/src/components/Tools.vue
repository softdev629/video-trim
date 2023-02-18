<template>
  <div class="tool-side-bar"
    :style="`width:${this.$store.state.set.toolSideBar}px; height:${this.$store.state.set.panelHeight}px`">
    <div v-for="subTool in subTools" :key="subTool.toolType">
      <SubTool :toolType="subTool.toolType" @subToolSelect="subToolSelect(subTool.toolType)"
        :active="selected[subTool.toolType]" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import SubTool from "./subToolComponents/SubTool.vue";
import { onMounted } from "vue";
import { useStore } from "vuex";
import setStore from "../store/modules/set.module";
import allSubTools from "../data/subTool.js";



export default {
  name: "Tools",
  data() {
    return {
      width: 50,
      height: 270,
      selected: [
        { trim: `` },
        { audio: `` },
        { text: `` },
        { shape: `` },
        { "reserved-menu": `` },
      ],
    };
  },
  mounted() {

    var panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + setStore.state.settingBoxWidth + 1);
    if (setStore.state.selectedSettingTool) {
      panelWidth = panelWidth - 40 - 1;
    }


    var panelHeight;
    if (this.height / this.panelWidth < setStore.state.screenRate) {
      panelHeight = setStore.state.screenHeight;
    }
    else {
      panelHeight = this.panelWidth * setStore.state.screenRate;
    }

    var payload = { type: "panelHeight", value: panelHeight };
    this.$store.dispatch("setData", payload);

    payload = { type: "panelWidth", value: panelWidth };
    this.$store.dispatch("setData", payload);
  },
  emits: ["forceRendering"],
  methods: {
    subToolSelect: function (toolType) {
      this.selected = [
        { trim: `` },
        { audio: `` },
        { text: `` },
        { shape: `` },
        { "reserved-menu": `` },
      ];
      this.selected[toolType] = `selected`;
      var payload = { type: "selectedSettingTool", value: toolType };
      this.$store.dispatch("setData", payload);

      payload = { type: "settingBoxWidth", value: 260 };
      this.$store.dispatch("setData", payload);
      this.$emit("forceRendering");

      var panelWidth = setStore.state.windowOuterWidth - (setStore.state.toolSideBar + 5 + 300 + 1);

      payload = { type: "panelWidth", value: panelWidth };
      this.$store.dispatch("setData", payload);


    },
  },
  setup() {
    const store = useStore();
    const subTools = ref(allSubTools);

    return { subTools };
  },
  components: {
    SubTool,
  },
};
</script>