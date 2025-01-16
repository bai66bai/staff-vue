import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'

//定义路由关系
const routes =[
  {path:'/',
    component: Layout,
      redirect:'/personnel',
      children:[
        { path:'/personnel',
        component:()=> import('@/views/personnel/PersonnelView.vue')},
        {path:'/position',
          component:()=> import('@/views/position/PositionView.vue')
        },
        {path:'/profile',
          component:()=> import('@/views/profile/Profile.vue')
        }
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
