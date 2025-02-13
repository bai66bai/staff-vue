import { defineStore } from 'pinia'
import { useTitle } from '@vueuse/core'
import { ref } from 'vue'

export const useSettingStore = defineStore('settings', () => {
  /**
   * 当前路由 - 防止页面刷新时，导航栏选中状态丢失
   */
  const currentRoute = ref('')

  function setTitle(newTitle: string) {
    useTitle().value = newTitle
  }

  return {
    currentRoute,
    setTitle,
  }
})
