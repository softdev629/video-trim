import { createRouter, createWebHistory } from 'vue-router'
import Upload from './components/Upload.vue'
import WorkplaceVue from './components/Workplace.vue'

const routes = [
  { path: '/upload', component: Upload },
  { path: '/workplace', component: WorkplaceVue }
]



const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;