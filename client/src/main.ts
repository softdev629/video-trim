import { createApp } from 'vue'
import { createStore } from 'vuex'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router'
import './trim.css'
import Upload from './components/Upload.vue';
import WorkplaceVue from './components/Workplace.vue';
import App from './App.vue';
import router from './router';
//import JQuery from 'jquery';
//import { FormTimepickerPlugin } from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';


//window.$ = JQuery;
// Vue.use(BootstrapVue);
// Vue.use(IconsPlugin);
// Vue.use(LayoutPlugin);
// Vue.use(ModalPlugin);
// Vue.use(DropdownPlugin);




createApp(App).use(router).use(store).mount('#app')

