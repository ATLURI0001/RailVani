import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function cloudflareSpaPlugin() {
  return {
    name: 'cloudflare-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (fs.existsSync(indexPath)) {
        // Create 200.html and 404.html for native Cloudflare SPA routing without problematic _redirects
        fs.copyFileSync(indexPath, path.join(distDir, '200.html'))
        fs.copyFileSync(indexPath, path.join(distDir, '404.html'))
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cloudflareSpaPlugin()],
  server: {
    port: 5173,
    open: false
  }
})
