export default {
  namespaced: true,
  state: {
    videoFrom: { mm: "00", ss: "00", ss1: "00" },
    videoTo: { mm: "12", ss: "77", ss1: "00" },
    texts: [
      {
        textFrom: { mm: "00", ss: "00", ss1: "00" },
        textTo: { mm: "00", ss: "00", ss1: "00" },
        textContent: "",
        textColor: "white",
        textBorderColor: "transparent",
        textBorderWidth: 0,
        textOffsetWidth: 0,
        textOffsetHeight: 0,
        textOffsetTop: 0,
        textOffsetLeft: 0,
      }
    ],
    shapes: [{
      shapeFrom: { mm: "00", ss: "00", ss1: "00" },
      shapeTo: { mm: "00", ss: "00", ss1: "00" },
      shapeContent: "",
      shapeBorderColor: "",
      shapeBorderWidth: 0,
      shapeColor: "",
      shapeOffsetWidth: 0,
      shapeOffsetHeight: 0,
      shapeOffsetTop: 0,
      shapeOffsetLeft: 0,
    }],
    audios: [{
      audioFrom: { mm: "00", ss: "00", ss1: "00" },
      audioTo: { mm: "00", ss: "00", ss1: "00" },
    }],
  },
  mutations: {
    ADD_UPLOAD_DATA(state, payload) {
      switch (payload.type) {
        case "from":
          state.videoFrom = payload.value;
          return;
        case "to":
          state.videoTo = payload.value;
          return;
        case "text":
          state.texts = { ...payload.value };
          return;
        case "shape":
          state.shapes = { ...payload.value };
          return;
        case "audio":
          state.audios = { ...payload.value };
          return;
        default:
          return;
      }
    }
  },
  actions: {
    addToUploadDatas(context, payload) {
      switch (payload.type) {
        case "from":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "to":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "text":
          const texts = context.state.texts;
          texts.push(payload);
          context.commit('ADD_UPLOAD_DATA', texts);
          return;
        case "shape":
          const shapes = context.state.shapes;
          texts.push(payload);
          context.commit('ADD_UPLOAD_DATA', shapes);
          return;
        case "audio":
          const audios = context.state.audios;
          texts.push(payload);
          context.commit('ADD_UPLOAD_DATA', audios);
          return;
        default:
          return;
      }
    }
  }
}