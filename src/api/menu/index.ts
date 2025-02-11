import request from '@/utils/request'

export async function getRouters(): ResponsePromise<Routes[]> {
  return request({
    //TODO：路径修改
    url: '/menu/auth/getRouters',
    method: 'GET',
  })
}
