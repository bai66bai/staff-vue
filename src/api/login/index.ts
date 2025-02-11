import request from '@/utils/request';
import type { LoginForm ,responseSource , UserInfo} from './type';

export const userLogin = (form:LoginForm):ResponsePromise<responseSource> =>{
    return request({
        url: '/login',
        method: 'POST',
        data:form
    });
}

export async function getInfo(): ResponsePromise<UserInfo> {
    return request({
    //TODO：路径接口待定
      url: '/user/auth/getInfo',
      method: 'GET',
    })
  }