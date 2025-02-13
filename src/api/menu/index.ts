import request from '@/utils/request'

export async function getRouters(): ResponsePromise<Routes[]> {
  return request({
    url: '/staff/user/getRouters',
    method: 'GET',
  })
}
