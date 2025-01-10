import router from '@/router';
import useStore from '@/store';
import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';


//定义一个变量,记录公共的前缀  ,  baseURL
//const baseURL = 'http://localhost:8080';
 const baseURL = '/api';
const service = axios.create({
  baseURL,
  timeout: 30 * 1000
})

// 设置允许跨域
axios.defaults.withCredentials = true;

/** 请求拦截 */
service.interceptors.request.use(

  (config) => {
    if (config.url === '/auth/login') { 
      config.headers["Service"] = 'staff'
      return config
     }

    // pinia
    const sysUserStore = useStore().sysUser;
    const { token } = storeToRefs(sysUserStore);

    if (!config.headers) { throw new Error(`config不能为空`) }

    config.headers.Authorization = "Bearer " + token.value
    return config

  },
  (error: any) => {
    return Promise.reject(error);
  }
);



/** 响应拦截 */
service.interceptors.response.use(
  (response: AxiosResponse<ResponseRecord<any>>): AxiosResponse<ResponseRecord<any>> => {

    if (response.status !== 200) {
      ElMessage({
        message: response.data.data,
        type: 'error'
      })
    }
    return response;
  },
  (error: any) => {

    if (error instanceof Object && error.hasOwnProperty('response')) {
      
      if (error.response.status === 401) {
        router.push('/login');
        ElMessage({
          message: '认证失败',
          type: 'error'
        })
      }
      return error.response;
    }

  }
)

export default service;