<template>
  <div class="popup-container">
    <div class="header">
      <span class="header-title">网页翻译</span>
      <button type="button" class="setting-icon" @click="openOptions"></button>
    </div>
    <div class="form-group">
      <select v-model="pageTranslationLanguage" class="language-select">
        <option v-for="item in languages" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <div class="actions">
      <button @click="translateFuc" class="btn-primary">翻译当前页面</button>
    </div>
    <div class="toggle-group">
      <label class="toggle-label">
        <span>显示划词翻译图标</span>
        <label class="switch">
          <input type="checkbox" v-model="showWordTranslationIcon" @change="toggleWordTranslation">
          <span class="slider round"></span>
        </label>
      </label>
    </div>
  </div>
</template>

<script setup>
  import {ref, onMounted} from "vue"
  import { constantLanguages } from "../utils/constant";

  const pageTranslationLanguage = ref('chinese_simplified');
  const showWordTranslationIcon = ref(false); // 默认关闭

  // 支持的语言列表
  const languages = constantLanguages

  // 初始化时加载设置
  onMounted(async () => {
    const result = await chrome.storage.sync.get(['pageTranslationLanguage', 'showWordTranslationIcon'])
    if (result.pageTranslationLanguage !== undefined) {
      pageTranslationLanguage.value = result.pageTranslationLanguage;
    }
    if (result.showWordTranslationIcon !== undefined) {
      showWordTranslationIcon.value = !!result.showWordTranslationIcon;
    }
  });

  // 切换划词翻译图标显示状态
  async function toggleWordTranslation() {
    // 保存设置到Chrome存储
    await chrome.storage.sync.set({
      showWordTranslationIcon: showWordTranslationIcon.value
    });
  }

  async function translateFuc() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'translatePage',
      targetLang: pageTranslationLanguage.value
    });
  }

  function openOptions () {
    chrome.runtime.openOptionsPage()
  }
</script>
