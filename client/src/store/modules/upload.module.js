/*state: {
  items: []
},

mutations: {
  MUTATE_ITEMS: (state, items) => {
      Vue.set(state, 'items', items);
      // or, better yet create a copy of the array
      Vue.set(state, 'items', [...items]);
  }
},

actions: {
  loadItems: (context, items) => {
      context.commit('MUTATE_ITEMS', items);
  }
}
*/
export default {
  state: {
    from: { mm: 0, ss: 0, ss1: 0 },
    to: { mm: 0, ss: 0, ss1: 0 },
    videoFrom: { mm: 0, ss: 0, ss1: 0 },
    videoTo: { mm: 0, ss: 0, ss1: 0 },
    cutFrom: { mm: 0, ss: 0, ss1: 0 },
    cutTo: { mm: 0, ss: 0, ss1: 0 },
    delay: { mm: 0, ss: 0, ss1: 0 },
    texts: [],
    shapes: [],
    audios: [],
  },
  mutations: {
    ADD_UPLOAD_DATA(state, payload) {
      switch (payload.type) {
        case "from":
          state.from = payload.value;
          return;
        case "to":
          state.to = payload.value;
          return;
        case "videoFrom":
          state.from = payload.value;
          return;
        case "videoTo":
          state.to = payload.value;
          return;
        case "cutFrom":
          state.from = payload.value;
          return;
        case "cutTo":
          state.to = payload.value;
          return;
        case "delay":
          state.to = payload.value;
          return;
        case "texts":
          state.texts = { ...payload.value };
          return;
        case "shapes":
          state.shapes = { ...payload.value };
          return;
        case "audios":
          state.audios = { ...payload.value };
          return;
        default:
          return;
      }
    },
    UPDATE_ITEMS(state, payload) {
      switch (payload.type) {
        case "texts":
          state.texts = [...payload.value];
          break;
        case "shapes":
          state.shapes = [...payload.value];
          break;
        case "audios":
          state.audios = [...payload.value];
          break;
        default:
          break;
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
        case "videoFrom":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "videoTo":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "cutFrom":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "cutTo":
          context.commit('ADD_UPLOAD_DATA', payload);
          return;
        case "texts":
          const texts = context.state.texts;
          texts.push(payload);
          context.commit('ADD_UPLOAD_DATA', texts);
          return;
        case "shapes":
          const shapes = context.state.shapes;
          shapes.push(payload);
          context.commit('ADD_UPLOAD_DATA', shapes);
          return;
        case "audios":
          const audios = context.state.audios;
          audios.push(payload);
          context.commit('ADD_UPLOAD_DATA', audios);
          return;
        default:
          return;
      }
    },
    updateToUploadDatas(context, payload) {
      context.commit('UPDATE_ITEMS', payload);
    }
  }
}