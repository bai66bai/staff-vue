const errCodeMap = new Map<number, string>([
    [400, '请求参数错误'],
    [401, '登录过期，请重新登录'],
    [403, '无权限访问'],
    [404, '请求资源不存在'],
    [405, '请求方法不支持'],
    [500, '服务器错误'],
    [502, '网关错误'],
    [503, '服务不可用'],
    [504, '网关超时'],
  ])
  
  export { errCodeMap }
  