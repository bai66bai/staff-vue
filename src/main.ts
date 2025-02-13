import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/staff.scss'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import { initGuard } from '@/router'
import  directive  from './directive'

import VueCropper from 'vue-cropper'; 
import 'vue-cropper/dist/index.css'

const app = createApp(App)

app.use(createPinia())
const pinia = createPinia();
const persist = createPersistedState()
pinia.use(persist)
app.use(pinia) 
app.use(VueCropper)
app.use(ElementPlus,{locale: zhCn})
app.use(router)
initGuard()
directive(app)

app.mount('#app')