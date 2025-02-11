import Cookies from 'js-cookie'
import useStore from '@/stores'

const TokenKey = 'Admin-Token'

function getToken() {
  return Cookies.get(TokenKey)
}

function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

function removeToken() {
  return Cookies.remove(TokenKey)
}

function authPermission(permission: string) {
  const userStore = useStore().sysUser

  const all_permission = '*:*:*'
  const permissions = userStore.permissions
  if (permission && permission.length > 0) {
    return permissions.some((v) => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role: string) {
  const userStore = useStore().sysUser

  const super_admin = 'admin'
  const roles = userStore.roles
  if (role && role.length > 0) {
    return roles.some((v) => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export { getToken, setToken, removeToken }

export default {
  /**
   * 验证用户是否含有指定权限，只需包含其中一个
   * @param permissions 操作需要的权限
   */
  hasPermiOr(permissions: string[]) {
    return permissions.some((item) => {
      return authPermission(item)
    })
  },

  /**
   * 验证用户是否含有指定角色，只需包含其中一个
   * @param roles 操作需要的角色
   */
  hasRoleOr(roles: string[]) {
    return roles.some((item) => {
      return authRole(item)
    })
  },
}
