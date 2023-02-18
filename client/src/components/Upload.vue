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
const { files, open, reset } = useFileDialog();

const router = useRouter()
const route = useRoute()

function selectFile() {
  open();
}

function selectedFile() {
  if (files) {
    console.log(files);
    // filesData.value = files.map(file => ({
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   lastModified: file.lastModified,
    // }))

    const formData = new FormData();
    formData.append('files', files);

    console.log(formData, 'formData');

    axios.post('https://localhost:3000/api/file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function (data) {
      console.log(data.data);
    })
      .catch(function () {
        console.log('FAILURE!!');
      });
    //    this.$router.push('/workplace');
    router.push('/workplace');

  }
}

const filesData = ref<{ name: string; size: number; type: string; lastModified: number }[]>([])
function onDrop(files: File[] | null) {
  filesData.value = []
  if (files) {
    console.log(files);
    // filesData.value = files.map(file => ({
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   lastModified: file.lastModified,
    // }))

    const formData = new FormData();
    formData.append('files', files);

    console.log(formData, 'formData');

    axios.post('https://localhost:3000/api/file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function (data) {
      console.log(data.data);
    })
      .catch(function () {
        console.log('FAILURE!!');
      });
    //    this.$router.push('/workplace');
  }
}

const dropZoneRef = ref<HTMLElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <header class="py-16">
    <h1 class="text-5xl font-bold text-center mb-6 tracking-widest	">Trim Video</h1>
    <p className="text-center mb-6 text-xl">
      Trim or cut video of any format
    </p>
  </header>

  <div class="flex flex-col gap-16 items-center justify-center">
    {{ files? selectedFile(): null }}
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
</template>
