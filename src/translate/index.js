import translate from 'i18n-jsautotranslate'

export const initTranslate = () => {
	// 默认使用微软翻译服务
	translate.service.use('client.edge')
	// 只在未启动时调用监听
	if (!translate.listener.isStart) {
		translate.listener.start()
	}
	// 将默认的localStorage改为sessionStorage
	translate.storage = {
		set: function (key, value) {
			sessionStorage.setItem(key, value)
		},
		get: function (key) {
			return sessionStorage.getItem(key)
		}
	}
	// 清除缓存的语言
	translate.language.clearCacheLanguage()
	// 默认对整个页面进行整体翻译
	translate.whole.enableAll()
	// 启用翻译中的遮罩层
	translate.progress.api.startUITip()
	// 隐藏自带的语言选择标签
	translate.selectLanguageTag.show = false
	// 需要忽略翻译的类名
	translate.ignore.class.push('ignoreClass')
	translate.execute()
	return translate
}
