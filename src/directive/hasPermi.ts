import useStore from '@/stores'
import type { Directive } from 'vue'

const hasPermi: Directive = {
  mounted(el, binding) {
    const userStore = useStore().sysUser
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = userStore.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission) => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  },
}
export default hasPermi