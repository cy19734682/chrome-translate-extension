import { constantCommonlyLanguages } from '../utils/constant.js'

const ID = 'translate-page'
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: ID,
		title: chrome.i18n.getMessage('menuTitle'),
		contexts: ['selection', 'page']
	})

	// 子菜单
	constantCommonlyLanguages.forEach((item) => {
		chrome.contextMenus.create({
			id: `${ID}-${item.value}`,
			parentId: ID,
			title: item.label,
			contexts: ['selection', 'page']
		})
	})
})

/**
 * 监听上下文菜单点击事件
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
	const menuItem = constantCommonlyLanguages?.find((item) => `${ID}-${item.value}` === info.menuItemId)
	if (menuItem) {
		chrome.tabs.sendMessage(tab.id, {
			action: 'translatePage',
			targetLang: menuItem?.value,
			text: info.selectionText
		})
	}
})

/**
 * 监听运行时消息事件
 */
chrome.runtime.onMessage.addListener((request) => {
	if (request.action === 'openOptionsPage') {
		chrome.runtime.openOptionsPage()
	}
})
