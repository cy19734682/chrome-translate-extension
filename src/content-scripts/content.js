import {initTranslate} from '../translate/index.js' // 多语言切换, 导入translate插件
import {showPopup} from '../utils/wordTranslation.js' // 单词翻译, 导入wordTranslation插件
const translate = initTranslate()
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translatePage') {
    if(request.text && request.targetLang){
      showPopup(request.text, request.targetLang)
    }else {
      const targetLang = request.targetLang || 'chinese_simplified'
      translate.changeLanguage(targetLang)
      // 获取自动翻译网站白名单，判断当前网站是否在白名单中, 如果不在白名单中, 则添加到白名单中,如果在白名单中, 则更新语言
      chrome.storage.local.get(['autoTranslationPageWhitelist'], (res) => {
        const whitelist = res?.autoTranslationPageWhitelist || []
        const _index = whitelist?.findIndex(item => item?.hostname === window.location.hostname)
        if(_index === -1){
          // 如果不在白名单中, 则添加到白名单中
          whitelist.push({
            hostname: window.location.hostname,
            language: targetLang
          })
        }else {
          // 如果在白名单中, 则更新语言
          whitelist[_index].language = targetLang
        }
        chrome.storage.local.set({
          autoTranslationPageWhitelist: whitelist
        })
      })
      sendResponse({ status: 'Translation started' })
    }
  }
})

// 自动翻译页面
function autoTranslationPage() {
  chrome.storage.local.get(['autoTranslationPageWhitelist','autoTranslationPage'], (res) => {
    const whiteObj = res?.autoTranslationPageWhitelist?.find(item => item?.hostname === window.location.hostname)
    if (whiteObj?.language && res?.autoTranslationPage) {
      translate.changeLanguage(whiteObj.language)
    }
  })
}
autoTranslationPage()
