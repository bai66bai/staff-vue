/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_BASE_SERVICE_NAME: string
    readonly VITE_BASE_SERVICE_NAME_CN: string
    readonly VITE_BASE_STORAGE_TYPE: string
    readonly VITE_BASE_RSA_PUBLIC_KEY: string
  }

  declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
  