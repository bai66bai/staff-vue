import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode })=> {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server:{
      proxy:{
        '/api':{ //获取路径中包含了api的请求
            target: env.VITE_BASE_URL,//后台服务所在的源
            changeOrigin:true, //修改源
            rewrite:(path)=>path.replace(/^\/api/,'') //api替换为''
        }
      }
    }
  }
})
