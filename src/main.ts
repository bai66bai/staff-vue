import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
const pinia = createPinia();
const persist = createPersistedState()
pinia.use(persist)
app.use(pinia)
app.use(ElementPlus,{locale: zhCn})
app.use(router)
app.mount('#app')