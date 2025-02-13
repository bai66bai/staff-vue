import {useSysUserStore} from './sysUser';
import {usePermiStore} from './permission';
import {useSettingStore} from './settings';

export default function useStore() {
    return {
        // 系统用户
        sysUser:useSysUserStore(),
        permission: usePermiStore(),
        settings: useSettingStore(),
    }
}