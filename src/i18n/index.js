import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

/**
 * Chrome 插件环境没有 navigator.language，
 * 用 chrome.i18n.getUILanguage() 最准确。
 * 返回形如 "zh-CN" 或 "en"。
 */
function getBrowserLang() {
	// 在 content-script/popup 里可直接调用
	const uiLang = chrome.i18n.getUILanguage() // "zh-CN" / "en" / "fr" ...
	const primary = uiLang.split('-')[0] // "zh" / "en" ...
	return primary === 'zh' ? 'zh' : 'en' // 只有中文才开中文，其余英文
}

const i18n = createI18n({
	legacy: false, // 必须关，才能用 Composition API
	globalInjection: true, // 模板里直接用 $t
	locale: getBrowserLang(), // 关键：跟随浏览器
	fallbackLocale: 'en',
	messages: { zh, en }
})

export default i18n
