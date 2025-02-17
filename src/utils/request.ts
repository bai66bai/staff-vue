import router from '@/router';
import useStore from '@/stores';
import axios, { AxiosError } from 'axios';
import { ElMessage , ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth';
import { errCodeMap } from '@/dictionary/requestDict';

const request = axios.create({
  //将环境变量中的VITE_BASE_URL赋值给baseURL
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30 * 1000
})

// 设置允许跨域
axios.defaults.withCredentials = true;

/** 请求拦截 */
request.interceptors.request.use(

  (config) => {
    config.headers["Service"] = import.meta.env.VITE_BASE_SERVICE_NAME
    if (!config.headers) { throw new Error(`config不能为空`) }
    config.headers["Authorization"] = getToken()    
    return config

  },
  (error: any) => {
    return Promise.reject(error);
  }
);

//响应拦截器

let isTokenExpiredModalVisible = false

request.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ResponseRecord<any>>) => {
    console.error(error.message)

    if (error.response) {
      if (error.response.status === 401) {
        if (error.config && error.config.url === '/login') {
          ElMessage.error({
            message: '用户名或密码错误',
            showClose: true,
          })
          return Promise.reject(error)
        }
        if(!isTokenExpiredModalVisible){
          isTokenExpiredModalVisible = true
          try{
            const boxRet = await ElMessageBox.confirm(
              '登录状态已过期，您可以继续留在该页面，或者重新登录',
              '系统提示',
              {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning',
              },
            )
            if (boxRet === 'confirm') {
              const store = useStore()
              const userStore = store.sysUser
              await userStore.Logout({
                sendRequest: false,
                routeLogin: true,
              })
    
              const settingsStore = store.settings
              router.push(`/login?redirect=${settingsStore.currentRoute}`)
            }
          } finally {
            isTokenExpiredModalVisible = false
          }
          return Promise.reject(error)
        }
        return Promise.reject(error)
      }

      const msg = errCodeMap.get(error.response.status) || '网络出现问题'
      ElMessage.error({
        message: `[${msg}]\n${error.response.data.msg}`,
        showClose: true,
      })
    }
    return Promise.reject(error)
  },
)

export default request
