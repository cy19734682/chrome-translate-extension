// src/popup/content.js
import { createApp } from 'vue'
import App from './App.vue'
import i18n from '../i18n'

// 可选：引入通用样式
// import './popup.css'

createApp(App).use(i18n).mount('#app')
