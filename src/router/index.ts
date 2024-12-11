import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

//定义路由关系
const routes =[
  {path:'/',
    component:Layout,
      redirect:'/personnel',
      children:[
        { path:'/personnel',
        component:()=> import('@/views/personnel/PersonnelView.vue')}
  ]},
  {
    path:'/login',
    component:()=>import('@/views/Login.vue')
  }
]



//创建路由器
const router = createRouter({
  history:createWebHistory(),
  routes:routes
})

export default router
