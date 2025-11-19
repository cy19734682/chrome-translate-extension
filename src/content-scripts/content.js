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
      chrome.storage.sync.set({
        autoTranslationLanguage: targetLang
      })
      sendResponse({ status: 'Translation started' })
    }
  }
})

// 自动翻译页面
function autoTranslationPage() {
  chrome.storage.sync.get(['autoTranslationPage', 'autoTranslationLanguage'], (res) => {
    if (res.autoTranslationPage && res.autoTranslationLanguage) {
      translate.changeLanguage(res.autoTranslationLanguage)
    }
  })
}
autoTranslationPage()
