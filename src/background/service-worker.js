chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translate-page',
    title: '翻译当前页面（中/英）',
    contexts: ['page'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-page') {
    chrome.tabs.sendMessage(tab.id, { action: 'translatePage' , isRight: true })
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage();
  }
});