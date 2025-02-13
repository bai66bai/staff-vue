import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'

import useStore from '@/stores/index'

declare module 'vue-router' {
  interface _RouteRecordBase {
    hidden?: boolean | string | number
    noShowingChildren?: boolean
    alwaysShow?: boolean
    query?: string
  }
}

/** vue-router */
const whiteList = ['/login', '/register']

const constantRoutes: readonly RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404View.vue'),
    hidden: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    hidden: true,
  },
  {
    path: '/layout',
    name: 'Layout',
    redirect: { name: 'profile' },
    component: ()=> import('@/views/Layout.vue'),
    children :[
      {
        path: '/',
        name: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心'}
      }
    ]
  }
]


const dynamicRoutes: RouteRecordWhale[] = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

const initGuard = async () => {
  /** Pinia */
  const store = useStore()
  const settingsStore = store.settings
  const userStore = store.sysUser
  const permissionStore = store.permission

  router.beforeEach(async (to, _from, next) => {
    settingsStore.currentRoute = to.path
    if (getToken()) {
      if (to.meta.title) {
        settingsStore.setTitle(
          `${import.meta.env.VITE_BASE_SERVICE_NAME_CN}-${to.meta.title as string}`,
        )
      }

      /* has token*/
      if (to.path === '/login') {
        settingsStore.currentRoute = '/login'
        next({ path: '/' })
      } else if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        if (userStore.roles.length === 0) {
          await userStore.GetInfo()
          if(userStore.roles.length === 0)
            next()
          else {
            const accessRoutes = await permissionStore.GenerateRoutes()
            accessRoutes.forEach((accessRoute) => {
              router.addRoute(accessRoute as RouteRecordRaw)
            })
            next({ ...to, replace: true })
          }
          
        } else {
          next()
        }
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        settingsStore.currentRoute = '/login'
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`) // 否则全部重定向到登录页
      }
    }
  })
}

export default router

export { constantRoutes, dynamicRoutes, initGuard }


//定义路由关系
// const routes =[
//   {path:'/',
//     component: Layout,
//       redirect:'/profile',
//       children:[
//         { path:'/personnel',
//         component:()=> import('@/views/personnel/PersonnelView.vue')},
//         {path:'/position',
//           component:()=> import('@/views/position/PositionView.vue')
//         },
//         {path:'/profile',
//           component:()=> import('@/views/profile/index.vue')
//         }
//   ]},
//   {
//     path:'/login',
//     component:()=>import('@/views/Login.vue')
//   }
// ]



//创建路由器
// const router = createRouter({
//   history:createWebHistory(),
//   routes:routes
// })
