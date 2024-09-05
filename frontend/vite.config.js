import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_PROXY_TARGET || 'http://localhost:4100'

  let proxy = {}
  ;['/admin', '/apeal', '/calendar', '/notification', '/addApeal', '/stats', '/profil_pictures', '/health'].forEach(p => {
    proxy[p] = { target, changeOrigin: true }
  })

  return {
    plugins: [vue()],
    server: {
      port: 5173,
      host: true,
      proxy
    },
  }
})
