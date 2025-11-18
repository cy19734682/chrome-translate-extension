<template>
  <div class="options-container">
    <header class="options-header">
      <h1>翻译插件设置</h1>
    </header>

    <main class="options-main">
      <div class="settings-section">
        <h2>默认设置</h2>
        <div class="form-group">
          <label>当前语言:</label>
          <select v-model="localLanguage">
            <option value="auto">自动</option>
            <option v-for="item in languages" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>目标语言:</label>
          <select v-model="pageTranslationLanguage">
            <option v-for="item in languages" :value="item.value">{{ item.label }}</option>
          </select>
        </div>
        <div class="form-group flex">
          <label>显示划词翻译图标:</label>
          <label class="switch">
            <input type="checkbox" v-model="showWordTranslationIcon" @change="toggleWordTranslation">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div class="actions">
        <button @click="saveSettings" class="btn-primary">保存设置</button>
        <button @click="resetSettings" class="btn-reset">恢复默认</button>
      </div>
      <div v-if="saveStatus" class="status-message" :class="saveStatus.type">
        {{ saveStatus.message }}
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { constantLanguages } from "../utils/constant";


  const localLanguage = ref('auto');
  const pageTranslationLanguage = ref('chinese_simplified');
  const showWordTranslationIcon = ref(false);
  // 支持的语言列表
  const languages = constantLanguages
  const saveStatus = ref(null)

  onMounted(async () => {
    const result = await chrome.storage.sync.get(['localLanguage', 'pageTranslationLanguage', 'showWordTranslationIcon'])
    if (result.localLanguage !== undefined) {
      localLanguage.value = result.localLanguage;
    }

    if (result.pageTranslationLanguage !== undefined) {
      pageTranslationLanguage.value = result.pageTranslationLanguage;
    }

    if (result.showWordTranslationIcon !== undefined) {
      showWordTranslationIcon.value = !!result.showWordTranslationIcon;
    }
  })



  // 切换划词翻译图标显示状态
  async function toggleWordTranslation() {
    // 保存设置到Chrome存储
    await chrome.storage.sync.set({
      showWordTranslationIcon: showWordTranslationIcon.value
    });
  }

  const saveSettings = async () => {
    try {
      await chrome.storage.sync.set({
        localLanguage: localLanguage.value,
        pageTranslationLanguage: pageTranslationLanguage.value,
        showWordTranslationIcon: showWordTranslationIcon.value
      })
      saveStatus.value = {
        type: 'success',
        message: '设置保存成功!'
      }
    } catch (error) {
      saveStatus.value = {
        type: 'error',
        message: '保存失败: ' + error.message
      }
    }
    setTimeout(() => {
      saveStatus.value = null
    }, 1500)
  }

  const resetSettings = async () => {
    localLanguage.value = 'chinese_simplified';
    pageTranslationLanguage.value = 'english';
    showWordTranslationIcon.value = false;
    await chrome.storage.sync.set({
      localLanguage: localLanguage.value,
      pageTranslationLanguage: pageTranslationLanguage.value,
      showWordTranslationIcon: showWordTranslationIcon.value
    })
  }
</script>
