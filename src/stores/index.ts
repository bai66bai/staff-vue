import {useSysUserStore} from './sysUser';

export default function useStore() {
    return {
        // 系统用户
        sysUser:useSysUserStore()
    }
}