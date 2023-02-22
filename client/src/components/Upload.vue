<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onMounted, ref } from "vue";
import { useFileDialog } from '@vueuse/core'
import { useDropZone } from '@vueuse/core'
// import router from '../router'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { throwStatement } from "@babel/types";
import { useStore } from "vuex";
//import CubeSpin from 'vue-loading-spinner/components/Cube';


const { files, open, reset } = useFileDialog();

const router = useRouter();
const route = useRoute();
const store = useStore();

const loader = ref();
const body = ref();
const comment = ref();

function selectFile() {
  open();
}

const selectedFile = () => {
  if (files && files.value && files.value.length > 0) {
    const formData = new FormData();
    formData.append('video', files.value[0]);

    loader.value.className = "loader";
    body.value.style.display = "none";
    comment.value.style.display = "block";

    axios.post('/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function (data) {
      var payload = { type: "fileName", value: data.data.filename };
      store.dispatch("setData", payload);
      payload = { type: "fileCount", value: data.data.filecount };
      store.dispatch("setData", payload);
      var duration = Number(data.data.duration) * 100;

      payload = {
        type: "duration", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);
      payload = {
        type: "videoTo", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);
      payload = {
        type: "cutTo", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);

      payload = {
        type: "to", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);
      router.push('/workplace');
    })
      .catch(function () {
        console.log('FAILURE!!');
        //    router.push('/workplace');
      });
    //    this.$router.push('/workplace');


  }
}

const filesData = ref<{ name: string; size: number; type: string; lastModified: number }[]>([]);

const onDrop = (files: File[] | null) => {
  filesData.value = []
  if (files) {

    const formData = new FormData();
    formData.append('video', files[0]);



    loader.value.className = "loader";
    body.value.style.display = "none";
    comment.value.style.display = "block";

    axios.post('/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function (data) {
      var payload = { type: "fileName", value: data.data.filename };
      store.dispatch("setData", payload);
      payload = { type: "fileCount", value: data.data.filecount };
      store.dispatch("setData", payload);
      let duration = Number(data.data.duration) * 100;

      payload = {
        type: "duration", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);
      payload = {
        type: "videoTo", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);

      payload = {
        type: "cutTo", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);

      payload = {
        type: "to", value: {
          mm: Math.trunc(duration / 6000),
          ss: Math.trunc((duration % 6000) / 100),
          ss1: Math.trunc((duration % 6000) % 100),
        }
      };
      store.dispatch("setData", payload);
      router.push('/workplace');
    })
      .catch(function () {
        console.log('FAILURE!!');
      });

  }

}

const dropZoneRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div ref="loader"></div>
  <div ref="comment" class="loading-text" :style="`display:none;`">Loading file.&nbsp;&nbsp;&nbsp;Wait a moment...</div>
  <div ref="body">
    <header class="py-16">
      <h1 class="text-5xl font-bold text-center mb-6 tracking-widest	">Video Editor</h1>
      <p className="text-center mb-6 text-xl">
        You can trim or cut video appended voices, several shapes and subtitles.
      </p>
    </header>
    <div class="flex flex-col gap-16 items-center justify-center">
      {{ files ? selectedFile() : null }}
      <button
        class="border border-white text-white bg-transparent text-2xl hover:px-20 px-10 py-4 rounded-xl inline-flex items-center transition-all duration-100"
        @click="selectFile">
        <span>Open file</span>
      </button>
      <div
        class="flex flex gap-5 items-center justify-center border border-white text-gray-300 bg-transparent rounded-xl px-20 py-4 text-2xl"
        ref="dropZoneRef" :value="isOverDropZone">
        <svg class="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        <span>or drop file here</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
