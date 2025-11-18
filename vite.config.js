import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import manifest from './manifest.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'src/popup/index.html'
      }
    }
  }
})