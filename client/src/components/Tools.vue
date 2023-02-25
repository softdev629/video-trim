<template>
  <div class="tool-side-bar" :style="`width:${this.$store.state.set.toolSideBar}px; height:100%`">
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
        { cut: `` },
      ],
    };
  },
  mounted() {

    var panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + this.$store.state.set.settingBoxWidth + 1);
    if (this.$store.state.set.selectedSettingTool) {
      panelWidth = panelWidth - 40 - 1;
    }


    var panelHeight;
    if (this.height / this.panelWidth < this.$store.state.set.screenRate) {
      panelHeight = this.$store.state.set.screenHeight;
    }
    else {
      panelHeight = this.panelWidth * this.$store.state.set.screenRate;
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
        { cut: `` },
      ];
      this.selected[toolType] = `selected`;

      var payload = { type: "selectedSettingTool", value: toolType };
      this.$store.dispatch("setData", payload);

      if (toolType == "cut") {
        payload = {
          type: "cutFrom", value: {
            mm: this.$store.state.set.videoFrom.mm,
            ss: this.$store.state.set.videoFrom.ss,
            ss1: this.$store.state.set.videoFrom.ss1
          }
        }
        this.$store.dispatch("setData", payload);

        payload = {
          type: "cutTo", value: {
            mm: this.$store.state.set.videoTo.mm,
            ss: this.$store.state.set.videoTo.ss,
            ss1: this.$store.state.set.videoTo.ss1
          }
        }
        this.$store.dispatch("setData", payload);
      }

      payload = { type: "settingBoxWidth", value: 260 };
      this.$store.dispatch("setData", payload);
      this.$emit("forceRendering");

      var panelWidth = this.$store.state.set.windowOuterWidth - (this.$store.state.set.toolSideBar + 5 + 300 + 1);

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