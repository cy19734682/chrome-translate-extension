import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve } from 'path'
import manifest from './manifest.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(__dirname, './src/i18n/locales/**'),
      runtimeOnly: true, // ✅ 关键：禁用运行时编译
    }),
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