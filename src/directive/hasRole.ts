import useStore from '@/stores'
import type { Directive } from 'vue'

const hasRole: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const super_admin = 'admin'
    const userStore = useStore().sysUser
    const roles = userStore.roles

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value

      const hasRole = roles.some((role) => {
        return super_admin === role || roleFlag.includes(role)
      })

      if (!hasRole && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置角色权限标签值`)
    }
  },
}

export default hasRole
