import {initTranslate} from '../translate/index.js' // 多语言切换, 导入translate插件
import '../utils/wordTranslation.js' // 单词翻译, 导入wordTranslation插件

const translate = initTranslate()
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translatePage') {
    // 右键菜单
    if (request.isRight) {
      const lang = translate.language.getCurrent();
      // 如果当前语言是中文，切换为英文
      if (lang === 'chinese_simplified') {
        translate.changeLanguage('english')
      } else {
        translate.changeLanguage('chinese_simplified')
      }
    }else {
      translate.changeLanguage(request.targetLang || 'chinese_simplified')
    }
    sendResponse({ status: 'Translation started' })
  }
})