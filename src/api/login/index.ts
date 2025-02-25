import type { LoginForm, responseSource, UserInfo } from './type';
import { rasEncrypt, request } from '@/utils/wr';

export const userLogin = (form: LoginForm): ResponsePromise<responseSource> => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      ...form,
      password: rasEncrypt(form.password)
    }
  }, { loading: true });
}

export async function getInfo(): ResponsePromise<UserInfo> {
  return request({
    url: '/staff/user/getInfo',
    method: 'GET',
  })
}
