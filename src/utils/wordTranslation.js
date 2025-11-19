import {constantLanguages} from "./constant"
import {initTranslate} from '../translate/index.js'

const translate = initTranslate()
// 图标元素
let iconDiv = null
// 弹窗元素
let popupDiv = null

// 创建图标
function createIcon() {
  if (iconDiv) {
    return iconDiv
  }
  iconDiv = document.createElement('cool-cte-translate-trigger')
  document.body.appendChild(iconDiv)
  const shadow = iconDiv.attachShadow({mode: 'open'})
  shadow.innerHTML = `
    <link rel="stylesheet" href="${chrome.runtime.getURL('style/common.css')}">
    <div class="ignoreClass translate-img" style=" position:absolute;left: -50px;top: -50px;z-index:99999;width: 25px;height: 25px;">
      <img src="${chrome.runtime.getURL('icons/icon-48.png')}" style="width: 100%;height: 100%;" alt="划词翻译" />
    </div>
  `
  iconDiv._shadow = shadow
  iconDiv._imgElement = shadow.querySelector('.translate-img')
  shadow.querySelector('.translate-img').onclick = () => {
    const text = window.getSelection().toString().trim()
    if (!text) {
      return
    }
    showPopup(text)
    hideIcon()
  }
  return iconDiv
}

// 创建弹窗
function createPopup(text, targetLang) {
  if (popupDiv) {
    return popupDiv
  }
  popupDiv = document.createElement('cool-cte-translate-tooltip')
  document.documentElement.appendChild(popupDiv)
  const shadow = popupDiv.attachShadow({mode: 'open'})
  // 目标语言列表
  const tgtLangOptions = constantLanguages.map(item => `<option value="${item.value}">${item.label}</option>`).join('')
  shadow.innerHTML = `
    <link rel="stylesheet" href="${chrome.runtime.getURL('style/common.css')}">
    <div class="ignoreClass translate-popup" style=" position:absolute;left: -800px;top: -300px;z-index:99999;width: 500px;">
      <!-- 头部 -->
      <div class="pop-header">
        <span class="pop-title">划词翻译</span>
        <div class="pop-header-right">
          <button type="button" id="settingPopup" class="setting-icon icon-white"></button>
          <span class="pop-close" id="closePopup">✕</span>
        </div>
      </div>
      <!-- 语言栏 -->
      <div class="pop-lang-row">
        <div class="lang-box">
          <label>源语言</label>
          <select id="srcLang">
            <option value="auto">自动</option>
            ${tgtLangOptions}
          </select>
        </div>
        <div class="lang-box">
          <label>目标语言</label>
          <select id="tgtLang">
            ${tgtLangOptions}
          </select>
        </div>
      </div>
      <!-- 翻译按钮 -->
      <button id="doTrans" class="pop-btn">翻 译</button>
      <!-- 结果区 -->
      <div id="transResult" class="pop-result"></div>
    </div>
  `
  popupDiv._shadow = shadow
  popupDiv._popupElement = shadow.querySelector('.translate-popup')
  shadow.querySelector('#closePopup').onclick = hidePopup
  shadow.querySelector('#settingPopup').onclick = () => {
    chrome.runtime.sendMessage({ action: "openOptionsPage" });
  }
  shadow.querySelector('#doTrans').onclick = () =>{
    const src = shadow.querySelector('#srcLang').value
    const tgt = shadow.querySelector('#tgtLang').value
    translateFunc(text, src, tgt)
  }
  // 初始化时就翻译一次
  setTimeout(async () => {
    if(targetLang){
      //targetLang 存在时，说明是划词后右键翻译，源语言默认自动识别
      shadow.querySelector('#srcLang').value = 'auto'
      shadow.querySelector('#tgtLang').value = targetLang
      translateFunc(text, 'auto', targetLang)
    }else {
      const result = await chrome.storage.sync.get(['localLanguage', 'pageTranslationLanguage'])
      const localLanguage = result?.localLanguage || 'auto'
      const pageTranslationLanguage = result?.pageTranslationLanguage || 'chinese_simplified'
      shadow.querySelector('#srcLang').value = localLanguage
      shadow.querySelector('#tgtLang').value = pageTranslationLanguage
      translateFunc(text, localLanguage, pageTranslationLanguage)
    }
  }, 50)
  return popupDiv
}

// 翻译核心：调用translate.js插件翻译
function translateFunc(text, src, tgt) {
  try {
    // 自动获取本地语言
    if(src === 'auto'){
      src = translateRecognition(text)
    }
    popupDiv._shadow.querySelector('#transResult').innerHTML = `<div class="pop-loader"></div>`
    translate.request.translateText({
      texts: [text],
      from: src,
      to: tgt
    }, function (data) {
      popupDiv._shadow.querySelector('#transResult').textContent = data?.text
    })
  }
  catch (error) {
    popupDiv._shadow.querySelector('#transResult').textContent = '翻译失败：' + error.message
  }
}

// 识别当前待翻译的语言
function translateRecognition(text) {
  const localLanguage = translate.language.getLocal()
  try {
    let lang = translate.language.recognition(text)
    return lang?.languageName || localLanguage
  }
  catch (error) {
    return localLanguage
  }
}


// 显示图标（在选区结束处）
const showIcon = (e) => {
  // 如果弹窗已显示，不重复显示图标
  if (popupDiv) {
    return
  }
  const sel = window.getSelection()
  if (!sel.rangeCount) {
    return
  }
  const lastMouseX = e.pageX
  const lastMouseY = e.pageY
  const icon = createIcon()
  const imgElement = icon._imgElement
  imgElement.style.left = (lastMouseX + 8) + 'px'
  imgElement.style.top = (lastMouseY + 8) + 'px'
}

// 显示弹窗
export const showPopup = (text, targetLang) => {
  // 如果弹窗已显示，不重复显示图标
  if (popupDiv) {
    return
  }
  const popup = createPopup(text, targetLang)
  const popupElement = popup._popupElement
  let {top, left, right} = popupPosition()
  const scrollX = window.scrollX
  const scrollY = window.scrollY
  // 延时加载，确保弹窗元素和样式已添加到DOM
  setTimeout(() => {
    /* 3. 先让 popup 显示一次，才能拿到它自己的宽高 */
    const pw = popupElement.offsetWidth
    const ph = popupElement.offsetHeight
    /* 4. 水平防溢出 */
    const vw = document.documentElement.clientWidth
    if (left + pw > vw - 4) {          // 右边超了
      left = right - pw      // 贴图标右边
      if (left < 4) {
        left = 4
      }          // 仍然超就贴左边缘
    }
    /* 5. 垂直防溢出 */
    const vh = document.documentElement.clientHeight
    if (top + ph > vh - 4) {           // 下方超了
      top = top - ph - 140     // 放到图标上方(这里写大点，流出翻译内容的高度)
      if (top < 4) {                   // 上方也超 → 放图标上方但允许滚动
        top = 4
      }
    }
    /* 6. 最终定位 */
    popupElement.style.left = (left + scrollX) + 'px'
    popupElement.style.top = (top + scrollY) + 'px'
    popupElement.querySelector('#transResult').textContent = ""
  }, 20)
}

/**
 * 弹窗位置调整
 */
function popupPosition() {
  if(iconDiv){
    // 如果图标存在，则根据图标位置调整弹窗位置
    const iconRect = iconDiv._imgElement.getBoundingClientRect() // 相对视口
    let top = iconRect.bottom + 4   // 下方 4px
    let left = iconRect.left
    let right = iconRect.right
    return {top, left, right}
  }else {
    let top = document.documentElement.clientWidth / 2 - 140
    let left = document.documentElement.clientHeight / 2 - 250
    let right = 0
    const sel = window.getSelection();
    if (!sel.rangeCount) return {top, left, right};
    const wholeRange = sel.getRangeAt(0);
    if (wholeRange.collapsed) return {top, left, right};
    const outerRect = wholeRange.getBoundingClientRect();
    top = outerRect.bottom + 4   // 下方 4px
    left = outerRect.left
    right = outerRect.right
    return {top, left, right}
  }
}


// 隐藏图标
const hideIcon = () => {
  if (iconDiv) {
    document.body.removeChild(iconDiv)
    iconDiv = null
  }
}

// 隐藏弹窗
const hidePopup = () => {
  if (popupDiv) {
    document.documentElement.removeChild(popupDiv)
    popupDiv = null
  }
}


// 监听鼠标释放事件
document.addEventListener('mouseup', e => {
  // 非左键点击，不处理
  if (e.button !== 0) {
    return
  }
  chrome.storage.sync.get('showWordTranslationIcon', (result) => {
    if (!!result.showWordTranslationIcon) {
      setTimeout(() => {          // 让选区先完成
        const text = window.getSelection().toString().trim()
        if (text) {
          showIcon(e)
        }
        else {
          hideIcon()
        }
      }, 10)
    }
  })
})

// 点击空白处关闭弹窗/图标
document.addEventListener('mousedown', e => {
  // 非左键点击，不处理
  if (e.button !== 0) {
    return
  }
  if (popupDiv && popupDiv.contains(e.target)) {
    return
  }
  if (iconDiv && iconDiv.contains(e.target)) {
    return
  }
  hideIcon()
  hidePopup()
});