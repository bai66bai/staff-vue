import { defineStore } from 'pinia';

export default defineStore('sysUser', {
    state: () => {
        return {
            sysUserName: '',// 用户名
            token:'',       // JWT
        };
    },
    actions: {
        // 退出登录
        logout() {
            this.sysUserName = '';
            this.token = '';
        },
    },
    persist:true
})