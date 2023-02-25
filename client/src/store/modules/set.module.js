export default {
  state: {
    windowWidth: 1350,
    windowOuterWidth: 1366,

    panelWidth: 0,
    panelHeight: 270,

    screenWidth: 480,
    screenHeight: 270,
    screenRate: 9 / 16,

    selectedSettingTool: 0,
    screenYControllerWidth: 0,
    settingBoxWidth: 0,
    toolSideBar: 50,
    workingPanelHeight: 300,

    from: { mm: 0, ss: 0, ss1: 0 },
    to: { mm: 0, ss: 12, ss1: 77 },

    videoFrom: { mm: 0, ss: 0, ss1: 0 },
    videoTo: { mm: 0, ss: 12, ss1: 77 },
    delay: { mm: 0, ss: 0, ss1: 0 },

    cutFrom: { mm: 0, ss: 0, ss1: 0 },
    cutTo: { mm: 0, ss: 0, ss1: 0 },
    cutDelay: { mm: 0, ss: 0, ss1: 0 },

    audioFrom: { mm: 0, ss: 0, ss1: 0 },
    audioTo: { mm: 0, ss: 0, ss1: 0 },
    audioDuration: 0,

    shapeFrom: { mm: 0, ss: 0, ss1: 0 },
    shapeTo: { mm: 0, ss: 0, ss1: 0 },
    shapeContent: "Rectangle",
    shapeBorderColor: "rgb(16,16,16)",
    shapeBorderWidth: 1,
    shapeColor: "rgb(16,16,16)",
    shapeOffsetWidth: 100,
    shapeOffsetHeight: 80,
    shapeOffsetTop: 100,
    shapeOffsetLeft: 100,

    textFrom: { mm: 0, ss: 0, ss1: 0 },
    textTo: { mm: 0, ss: 0, ss1: 0 },
    textContent: "",
    textColor: "#FFFFFF",
    textBorderColor: "transparent",
    textBorderWidth: 1,
    textOffsetWidth: 150,
    textOffsetHeight: 50,
    textOffsetTop: 40,
    textOffsetLeft: 1000,

    areaHeight: 30,
    duration: { mm: 0, ss: 12, ss1: 77 },
    curTime: { mm: 0, ss: 0, ss1: 0 }, // selected or current play time
    zoom: 1,
    fileName: "",
    fileCount: 0,
    fileName: "",
    fileCount: 0,
    loader: "none",
    all: "block",
    isPlay: false, // play or pause
    comment: "none",
    commentDisplay: "none",
    relaseFlag: false,
    changeState: 0
  },
  mutations: {
    INIT_SET_DATA(state) {
      state.windowWidth = 1350;
      state.windowOuterWidth = 1366;

      state.panelWidth = 0;
      state.panelHeight = 270;

      state.screenWidth = 480;
      state.screenHeight = 270;
      state.screenRate = 9 / 16;

      state.selectedSettingTool = 0;
      state.screenYControllerWidth = 0;
      state.settingBoxWidth = 0;
      state.toolSideBar = 50;
      state.workingPanelHeight = 300;

      state.from = { mm: "00", ss: "00", ss1: "00" };
      state.to = { mm: "12", ss: "77", ss1: "00" };

      state.videoFrom = { mm: 0, ss: 0, ss1: 0 };
      state.videoTo = { mm: 0, ss: 12, ss1: 77 };
      state.delay = { mm: 0, ss: 0, ss1: 0 };

      state.cutFrom = { mm: 0, ss: 0, ss1: 0 };
      state.cutTo = { mm: 0, ss: 0, ss1: 0 };
      state.cutDelay = { mm: 0, ss: 0, ss1: 0 };

      state.audioFrom = { mm: 0, ss: 0, ss1: 0 };
      state.audioTo = { mm: 0, ss: 0, ss1: 0 };
      state.audioDuration = 0;

      state.shapeFrom = { mm: 0, ss: 0, ss1: 0 };
      state.shapeTo = { mm: 0, ss: 0, ss1: 0 };
      state.shapeContent = "Rectangle";
      state.shapeBorderColor = "rgb(16,16,16)";
      state.shapeBorderWidth = 1;
      state.shapeColor = "rgb(16,16,16)";
      state.shapeOffsetWidth = 100;
      state.shapeOffsetHeight = 80;
      state.shapeOffsetTop = 150;
      state.shapeOffsetLeft = 770;

      state.textFrom = { mm: 0, ss: 0, ss1: 0 };
      state.textTo = { mm: 0, ss: 0, ss1: 0 };
      state.textContent = "";
      state.textColor = "#FFFFFF";
      state.textBorderColor = "transparent";
      state.textBorderWidth = 1;
      state.textOffsetWidth = 150;
      state.textOffsetHeight = 50;
      state.textOffsetTop = 40;
      state.textOffsetLeft = 1000;

      state.areaHeight = 30;
      state.duration = { mm: 0, ss: 12, ss1: 77 };
      state.curTime = { mm: 0, ss: 0, ss1: 0 }; // selected or current play time
      state.zoom = 1;
      state.fileName = "";
      state.fileCount = 0;
      state.loader = "none";
      state.all = "block";
      state.isPlay = false;
      state.comment = "none";
      state.commentDisplay = "none";
      state.relaseFlag = false;
      state.changeState = 0;
    },
    UPDATE_SET_DATA(state, payload) {
      switch (payload.type) {
        case "windowWidth":
          state.windowWidth = payload.value;
          return;
        case "windowOuterWidth":
          state.windowOuterWidth = payload.value;
          return;

        case "panelWidth":
          state.panelWidth = payload.value;
          return;
        case "panelHeight":
          state.panelHeight = payload.value;
          return;

        case "screenWidth":
          state.screenWidth = payload.value;
          return;
        case "screenHeight":
          state.screenHeight = payload.value;
          return;
        case "screenRate":
          state.screenRate = payload.value;
          return;

        case "selectedSettingTool":
          state.selectedSettingTool = payload.value;
          return;
        case "screenYControllerWidth":
          state.screenYControllerWidth = payload.value;
          return;
        case "settingBoxWidth":
          state.settingBoxWidth = payload.value;
          return;
        case "toolSideBar":
          state.toolSideBar = payload.value;
          return;
        case "workingPanelHeight":
          state.workingPanelHeight = payload.value;
          return;


        case "from":
          state.from = payload.value;
          return;
        case "to":
          state.to = payload.value;
          return;

        case "videoFrom":
          state.videoFrom = payload.value;
          return;
        case "videoTo":
          state.videoTo = payload.value;
          return;
        case "delay":
          state.delay = payload.value;
          return;

        case "cutFrom":
          state.cutFrom = payload.value;
          return;
        case "cutTo":
          state.cutTo = payload.value;
          return;
        case "cutDelay":
          state.cutDelay = payload.value;
          return;

        case "audioFrom":
          state.audioFrom = payload.value;
          return;
        case "audioTo":
          state.audioTo = payload.value;
          return;
        case "audioDuration":
          state.audioDuration = payload.value;
          return;
        case "shapeFrom":
          state.shapeFrom = payload.value;
          return;
        case "shapeTo":
          state.shapeTo = payload.value;
          return;
        case "shapeBorderWidth":
          state.shapeBorderWidth = payload.value;
          return;
        case "shapeBorderColor":
          state.shapeBorderColor = payload.value;
          return;
        case "shapeContent":
          state.shapeContent = payload.value;
          return;
        case "shapeColor":
          state.shapeColor = payload.value;
          return;
        case "shapeOffsetWidth":
          state.shapeOffsetWidth = payload.value;
          return;
        case "shapeOffsetHeight":
          state.shapeOffsetHeight = payload.value;
          return;
        case "shapeOffsetTop":
          state.shapeOffsetTop = payload.value;
          return;
        case "shapeOffsetLeft":
          state.shapeOffsetLeft = payload.value;
          return;

        case "textFrom":
          state.textFrom = payload.value;
          return;
        case "textTo":
          state.textTo = payload.value;
          return;
        case "textContent":
          state.textContent = payload.value;
          return;
        case "textColor":
          state.textColor = payload.value;
          return;
        case "textBorderColor":
          state.textBorderColor = payload.value;
          return;
        case "textBorderWidth":
          state.textBorderWidth = payload.value;
          return;
        case "textOffsetWidth":
          state.textOffsetWidth = payload.value;
          return;
        case "textOffsetHeight":
          state.textOffsetHeight = payload.value;
          return;
        case "textOffsetTop":
          state.textOffsetTop = payload.value;
          return;
        case "textOffsetLeft":
          state.textOffsetLeft = payload.value;
          return;

        case "areaHeight":
          state.areaHeight = 30;
          return;
        case "duration":
          state.duration = payload.value;
          return;
        case "curTime":
          state.curTime = payload.value;
          return;
        case "zoom":
          state.zoom = payload.value;
        case "fileName":
          state.fileName = payload.value;
        case "fileCount":
          state.fileCount = payload.value;
        case "loader":
          state.loader = payload.value;
          break;
        case "all":
          state.all = payload.value;
          break;
        case "isPlay":
          state.isPlay = payload.value;
          break;
        case "comment":
          state.comment = payload.value;
          break;
        case "commentDisplay":
          state.commentDisplay = payload.value;
          break;
        case "relaseFlag":
          state.relaseFlag = payload.value;
          break;
        case "changeState":
          state.changeState = payload.value;
          break;
        default:
          return;
      }
    },
    DELETE_SET_DATA(state, payload) {
      switch (payload.type) {
        case "windowWidth":
          state.windowWidth = 1350;
          return;
        case "windowOuterWidth":
          state.windowOuterWidth = 1366;
          return;

        case "panelWidth":
          state.panelWidth = 0;
          return;
        case "panelHeight":
          state.panelHeight = 270;
          return;


        case "screenWidth":
          state.screenWidth = 480;
          return;
        case "screenHeight":
          state.screenHeight = 270;
          return;
        case "screenRate":
          state.screenRate = 9 / 16;
          return;


        case "selectedSettingTool":
          state.selectedSettingTool = 0;
          return;
        case "screenYControllerWidth":
          state.screenYControllerWidth = 0;
          return;
        case "settingBoxWidth":
          state.settingBoxWidth = 0;
          return;
        case "toolSideBar":
          state.toolSideBar = 50;
          return;
        case "workingPanelHeight":
          state.workingPanelHeight = 300;
          return;

        case "from":
          state.from = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "to":
          state.to = { mm: 0, ss: 0, ss1: 0 };
          return;



        case "videoFrom":
          state.from = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "videoTo":
          state.to = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "delay":
          state.to = { mm: 0, ss: 0, ss1: 0 };
          return;


        case "cutFrom":
          state.cutFrom = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "cutTo":
          state.cutTo = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "cutDelay":
          state.cutDelay = { mm: 0, ss: 0, ss1: 0 };
          return;


        case "audioFrom":
          state.audioFrom = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "audioTo":
          state.audioTo = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "audioDuration":
          state.audioDuration = 0;
          return;
        case "shapeFrom":
          state.shapeFrom = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "shapeTo":
          state.shapeTo = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "shapeBorderWidth":
          state.shapeBorderWidth = 1;
          return;
        case "shapeBorderColor":
          state.shapeBorderColor = "rgb(16,16,16)";
          return;
        case "shapeContent":
          state.shapeContent = "Rectangle";
          return;
        case "shapeColor":
          state.shapeColor = "rgb(16,16,16)";
          return;
        case "shapeOffsetWidth":
          state.shapeOffsetWidth = 100;
          return;
        case "shapeOffsetHeight":
          state.shapeOffsetHeight = 80;
          return;
        case "shapeOffsetTop":
          state.shapeOffsetTop = 150;
          return;
        case "shapeOffsetLeft":
          state.shapeOffsetLeft = 770;
          return;

        case "textFrom":
          state.textFrom = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "textTo":
          state.textTo = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "textContent":
          state.textContent = "";
          return;
        case "textColor":
          state.textColor = "#FFFFFF";
          return;
        case "textBorderColor":
          state.textBorderColor = "transparent";
          return;
        case "textBorderWidth":
          state.textBorderWidth = 1;
          return;
        case "textOffsetWidth":
          state.textOffsetWidth = 150;
          return;
        case "textOffsetHeight":
          state.textOffsetHeight = 50;
          return;
        case "textOffsetTop":
          state.textOffsetTop = 40;
          return;
        case "textOffsetLeft":
          state.textOffsetLeft = 1000;
          return;

        case "areaHeight":
          state.areaHeight = 30;
          return;
        case "areaHeight":
          state.duration = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "curTime":
          state.curTime = { mm: 0, ss: 0, ss1: 0 };
          return;
        case "zoom":
          state.zoom = 1;
          return;
        case "fileName":
          state.fileName = null;
          return;
        case "fileCount":
          state.fileCount = 0;
          return;
        case "loader":
          state.loader = "none";
          return;
        case "all":
          state.all = "block";
          return;
        case "isPlay":
          state.isPlay = false;
          return;
        case "comment":
          state.comment = "none";
          break;
        case "commentDisplay":
          state.commentDisplay = "none";
          break;
        case "relaseFlag":
          state.relaseFlag = false;
          break;
        case "changeState":
          state.changeState = 0;
          break;
        default:
          return;
      }
    },
    TIME_OBJ_TO_TIME(state, obj) {
      return obj.mm * 6000 + obj.ss * 100 + obj.ss1;
    }
  },
  actions: {
    initData(context) {
      context.commit("INIT_SET_DATA");
    },
    setData(context, payload) {
      context.commit("UPDATE_SET_DATA", payload);
    },
    delData(context, payload) {
      context.commit("DELETE_SET_DATA", payload);
    },
    recordAudio() {
      new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });

        const start = () => {
          audioChunks = [];
          mediaRecorder.start();
        };

        const stop = () =>
          new Promise(resolve => {
            mediaRecorder.addEventListener('stop', () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              const play = () => audio.play();
              resolve({ audioChunks, audioBlob, audioUrl, play });
            });

            mediaRecorder.stop();
          });

        resolve({ start, stop });
      });
    },
    timeObjToTime(context, obj) {
      context.commit("TIME_OBJ_TO_TIME", obj);
    },
    timeToTimeObj: (context, time) => {
      //      console.log('timeToTimeObj', time);
      // context.commit("TIME_OBJ_TO_TIME", time);
      // return time;
      // let obj = {
      //   mm: Math.trunc(time / 6000),
      //   ss: Math.trunc((time % 6000) / 100),
      //   ss1: Math.trunc((time % 6000) % 100)
      // }
      // console.log("obj", obj);
      // return obj;
    },
    timeToPixel(context, time) {
      let pixel;
      return pixel;
    },
    pixelToTime(context, pixel) {
      let time;
      return time;
    }
  }

};
