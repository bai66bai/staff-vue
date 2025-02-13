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
      url: '/staff/user/getInfo',
      method: 'GET',
    })
  }
