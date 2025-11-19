import {initTranslate} from '../translate/index.js' // 多语言切换, 导入translate插件
import {showPopup} from '../utils/wordTranslation.js' // 单词翻译, 导入wordTranslation插件

const translate = initTranslate()
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translatePage') {
    if(request.text && request.targetLang){
      showPopup(request.text, request.targetLang)
    }else {
      translate.changeLanguage(request.targetLang || 'chinese_simplified')
      sendResponse({ status: 'Translation started' })
    }
  }
})