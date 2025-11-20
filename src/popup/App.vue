<template>
	<div class="popup-container">
		<div class="header">
			<span class="header-title">{{ t('webTranslate') }}</span>
			<button type="button" class="setting-icon" @click="openOptions"></button>
		</div>
		<div class="form-group">
			<select v-model="pageTranslationLanguage" class="language-select">
				<option v-for="item in languages" :value="item.value">{{ item.label }}</option>
			</select>
		</div>
		<div class="actions">
			<button @click="translateFuc" class="btn-primary">{{ t('translateCurrentPage') }}</button>
		</div>
		<div class="toggle-group">
			<label class="toggle-label">
				<span>{{ t('showWordTranslationIcon') }}</span>
				<label class="switch">
					<input type="checkbox" v-model="showWordTranslationIcon" @change="toggleWordTranslation" />
					<span class="slider round"></span>
				</label>
			</label>
		</div>
		<div class="toggle-group">
			<label class="toggle-label">
				<span>{{ t('autoTranslationPage') }}</span>
				<label class="switch">
					<input type="checkbox" v-model="autoTranslationPage" @change="toggleAutoTranslationPage" />
					<span class="slider round"></span>
				</label>
			</label>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { constantLanguages } from '../utils/constant'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()

	const pageTranslationLanguage = ref('chinese_simplified')
	const showWordTranslationIcon = ref(false) // 默认关闭
	const autoTranslationPage = ref(false) // 默认关闭

	// 支持的语言列表
	const languages = constantLanguages

	// 初始化时加载设置
	onMounted(async () => {
		const result = await chrome.storage.local.get([
			'pageTranslationLanguage',
			'showWordTranslationIcon',
			'autoTranslationPage'
		])
		if (result.pageTranslationLanguage !== undefined) {
			pageTranslationLanguage.value = result.pageTranslationLanguage
		}
		if (result.showWordTranslationIcon !== undefined) {
			showWordTranslationIcon.value = !!result.showWordTranslationIcon
		}
		if (result.autoTranslationPage !== undefined) {
			autoTranslationPage.value = !!result.autoTranslationPage
		}
	})

	// 切换划词翻译图标显示状态
	async function toggleWordTranslation() {
		console.log(t('sourceLang'))
		// 保存设置到Chrome存储
		await chrome.storage.local.set({
			showWordTranslationIcon: showWordTranslationIcon.value
		})
	}

	// 切换网页自动翻译状态
	async function toggleAutoTranslationPage() {
		// 保存设置到Chrome存储
		await chrome.storage.local.set({
			autoTranslationPage: autoTranslationPage.value
		})
	}

	async function translateFuc() {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
		chrome.tabs.sendMessage(tab.id, {
			action: 'translatePage',
			targetLang: pageTranslationLanguage.value
		})
	}

	function openOptions() {
		chrome.runtime.openOptionsPage()
	}
</script>
