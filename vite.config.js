import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, 
    commonjsOptions: {
      transformMixedEsModules: true, 
      esmExternals: ['react', 'react-dom'] 
    },
    rollupOptions: {
      output: {
        interop: 'auto' 
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all',
    hmr: {
      host: 'xiqo-h510.taile2f50f.ts.net', 
      protocol: 'wss',
      clientPort: 443 // Adicionado: obriga o Vite a rodar as atualizações pela porta segura do Tailscale
    }
  }
})
