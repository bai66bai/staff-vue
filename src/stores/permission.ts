// import { defineStore } from 'pinia'
// import { reactive } from 'vue'
// import router, { constantRoutes, dynamicRoutes } from '@/router'
// import auth from '@/utils/auth'
// import Layout from '@/views/Layout.vue'

// import { getRouters } from '@/api/menu'

// import type { RouteRecordRaw } from 'vue-router'

// // 匹配views里面所有的.vue文件
// const modules = import.meta.glob('@/views/**/*.vue')

// export const usePermiStore = defineStore('permission', () => {
//   const routeState = reactive({
//     routes: [] as Array<RouteRecordRaw>,
//     addRoutes: [] as Array<RouteRecordRaw>,
//     defaultRoutes: [] as Array<RouteRecordRaw>,
//     topbarRouters: [] as Array<RouteRecordRaw>,
//     sidebarRouters: [] as Array<RouteRecordRaw>,
//   })

//   function SET_ROUTES(routesNew: RouteRecordRaw[]) {
//     routeState.addRoutes = routesNew
//     routeState.routes = [...constantRoutes, ...routesNew]
//   }

//   function SET_DEFAULT_ROUTES(routesNew: RouteRecordRaw[]) {
//     routeState.defaultRoutes = [...constantRoutes, ...routesNew]
//   }

//   function SET_TOPBAR_ROUTES(routesNew: RouteRecordRaw[]) {
//     routeState.topbarRouters = routesNew
//   }

//   function SET_SIDEBAR_ROUTERS(routesNew: RouteRecordRaw[]) {
//     routeState.sidebarRouters = routesNew
//   }

//   const GenerateRoutes = async () => {
//     const resRecord = (await getRouters()).data
//     const sdata = JSON.parse(JSON.stringify(resRecord.data)) as Routes[]
//     const rdata = JSON.parse(JSON.stringify(resRecord.data)) as Routes[]
//     const sidebarRoutes = filterAsyncRouter(sdata)
//     const rewriteRoutes = filterAsyncRouter(rdata, false, true)
//     const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
//     asyncRoutes.forEach((asyncRoute) => {
//       router.addRoute(asyncRoute)
//     })
//     SET_ROUTES(rewriteRoutes as RouteRecordRaw[])
//     SET_DEFAULT_ROUTES(sidebarRoutes as RouteRecordRaw[])
//     SET_TOPBAR_ROUTES(sidebarRoutes as RouteRecordRaw[])
//     SET_SIDEBAR_ROUTERS([...constantRoutes, ...sidebarRoutes] as RouteRecordRaw[])

//     return rewriteRoutes
//   }

//   return {
//     routeRecord: routeState,
//     GenerateRoutes,
//     SET_ROUTES,
//     SET_DEFAULT_ROUTES,
//     SET_TOPBAR_ROUTES,
//     SET_SIDEBAR_ROUTERS,
//   }
// })

// function filterAsyncRouter(
//   asyncRouterMap: Routes[],
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   _lastRouter: boolean | Routes = false,
//   type = false,
// ) {
//   return asyncRouterMap.filter((route) => {
//     if (type && route.children) {
//       route.children = filterChildren(route.children)
//     }
//     if (route.component) {
//       // Layout ParentView 组件特殊处理
//       if (route.component === 'Layout') {
//         route.component = Layout
//       } else {
//         route.component = loadView(route.component as string)
//       }
//     }
//     if (route.children != null && route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children, route, type)
//     } else {
//       delete route['children']
//       delete route['redirect']
//     }
//     return true
//   })
// }

// function filterChildren(childrenMap: Routes[], lastRouter: Routes | boolean = false) {
//   let children: Routes[] = []
//   childrenMap.forEach((el) => {
//     if (el.children && el.children.length && el.component === 'ParentView' && !lastRouter) {
//       el.children.forEach((c) => {
//         c.path = el.path + '/' + c.path
//         if (c.children && c.children.length) {
//           children = children.concat(filterChildren(c.children, c))
//           return
//         }
//         children.push(c)
//       })
//       return
//     }
//     if (lastRouter) {
//       lastRouter = lastRouter as Routes
//       el.path = lastRouter.path + '/' + el.path
//       if (el.children && el.children.length) {
//         children = children.concat(filterChildren(el.children, el))
//         return
//       }
//     }
//     children = children.concat(el)
//   })
//   return children
// }

// export function filterDynamicRoutes(routes: RouteRecordWhale[]) {
//   const res: RouteRecordRaw[] = []
//   routes.forEach((route) => {
//     if (route.permission && auth.hasPermiOr(route.permission)) {
//       delete route['permission']
//       delete route['role']
//       res.push(route as RouteRecordRaw)
//     } else if (route.role && auth.hasRoleOr(route.role)) {
//       delete route['permission']
//       delete route['role']
//       res.push(route as RouteRecordRaw)
//     }
//   })
//   return res as RouteRecordRaw[]
// }

// export const loadView = (view: string) => {
//   let res
//   for (const path in modules) {
//     const dir = path.split('views/')[1].split('.vue')[0]

//     if (dir === view) {
//       res = () => modules[path]()
//     }
//   }
//   return res
// }
// // LoginInforView
