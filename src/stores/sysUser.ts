import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { setToken, removeToken, getToken } from '@/utils/auth'
import { logout } from '@/api/personnel';
import { getInfo } from '@/api/login';
import router from '@/router';
import { usePermiStore } from './permission';

export const useSysUserStore = defineStore('sysUser', () => {

  const token = computed(() => getToken())
  const id = ref<number>()
  const name = ref('')
  const avatar = ref('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])


  function SET_TOKEN(tokenToSet: string) {
    setToken(tokenToSet)
  }

  function SET_ID(idToSet: number) {
    id.value = idToSet
  }

  function SET_NAME(nameToSet: string) {
    name.value = nameToSet
  }

  function SET_AVATAR(avatarToSet: string) {
    avatar.value = avatarToSet
  }

  function SET_ROLES(rolesToSet: string[]) {
    roles.value = rolesToSet
  }

  function SET_PERMISSIONS(permissionsToSet: string[]) {
    permissions.value = permissionsToSet
  }

  /**
   * 获取用户信息
   */
async function GetInfo() {
  const resRecord = (await getInfo()).data
  if(resRecord.status !== 200) return

  const { user,permissions,roles } = resRecord.data
  const { id , username ,avatarUrl } = user

  if(roles && roles.length > 0){
    SET_ROLES(roles)
    SET_PERMISSIONS(permissions)
    SET_AVATAR(avatarUrl)
 }
  SET_ID(id)
  SET_NAME(username)
}
  

  /**
   * 退出登录
   */
  async function Logout(logOutOptions: { sendRequest?: boolean; routeLogin?: boolean }) {
    const { sendRequest = true, routeLogin = true } = logOutOptions
    if (sendRequest) await logout()
    SET_TOKEN('')
    SET_ROLES([])
    SET_PERMISSIONS([])

    const { SET_ROUTES ,SET_DEFAULT_ROUTES, SET_SIDEBAR_ROUTERS, SET_TOPBAR_ROUTES } = usePermiStore()
    SET_ROUTES([])
    SET_DEFAULT_ROUTES([])
    SET_SIDEBAR_ROUTERS([])
    SET_TOPBAR_ROUTES([])

    removeToken()
    if (routeLogin) router.push('/login')
  }


  return {
    token,
    id,
    name,
    avatar,
    roles,
    permissions,
    SET_TOKEN,
    SET_ROLES,
    SET_PERMISSIONS,
    SET_ID,
    SET_NAME,
    Logout,
    GetInfo
  }
})