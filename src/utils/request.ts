import router from '@/router';
import useStore from '@/stores';
import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { getToken } from '@/utils/auth';

const service = axios.create({
  //将环境变量中的VITE_BASE_URL赋值给baseURL
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30 * 1000
})

// 设置允许跨域
axios.defaults.withCredentials = true;

/** 请求拦截 */
service.interceptors.request.use(

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