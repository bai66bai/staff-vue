/** 登录表单 */
export interface LoginForm {
    username: string,
    password: string
}

export interface responseSource{
    access_token: string,
    expires_in: string
}

export interface UserInfo {
    user: User
    roles: string[]
    permissions: string[]
  }


  export interface User {
    id: number
    uniId: string
    username: string
    deptId: number
    createTime: string
    updateTime: string
    delFlag: string
    avatarUrl: string
  }
  