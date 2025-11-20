<template>
	<div class="options-container">
		<header class="options-header">
			<h1>{{ t('translateSetting') }}</h1>
		</header>
		<main class="options-main">
			<div class="settings-section">
				<h2>{{ t('defaultSetting') }}</h2>
				<div class="form-group">
					<label>{{ t('currentLanguage') }}:</label>
					<select class="language-select" v-model="localLanguage">
						<option value="auto">{{ t('auto') }}</option>
						<option v-for="item in languages" :value="item.value">{{ item.label }}</option>
					</select>
				</div>
				<div class="form-group">
					<label>{{ t('targetLanguage') }}:</label>
					<select class="language-select" v-model="pageTranslationLanguage">
						<option v-for="item in languages" :value="item.value">{{ item.label }}</option>
					</select>
				</div>
				<div class="form-group" v-if="autoTranslationPageWhitelist.length > 0">
					<label>{{ t('autoTranslationPageWhitelist') }}:</label>
					<!---展示域名和翻译目标语言，翻译语言可修改，并且提供删除按钮-->
					<div class="white-container">
						<div class="white-item" style="color: #666666">
							<span>{{ t('hostName') }}</span>
							<span>{{ t('targetLanguage') }}</span>
							<span style="width: 30px">{{ t('operation') }}</span>
						</div>
						<div class="white-item" v-for="(item, index) in autoTranslationPageWhitelist" :key="item.hostname">
							<span class="hostname">{{ item.hostname }}</span>
							<select class="language-select" v-model="item.language">
								<option v-for="lang in languages" :value="lang.value">{{ lang.label }}</option>
							</select>
							<button class="btn-reset" @click="removeWhitelist(index)">{{ t('delete') }}</button>
						</div>
					</div>
				</div>
				<div class="form-group flex">
					<label>{{ t('autoTranslationPage') }}:</label>
					<label class="switch">
						<input type="checkbox" v-model="autoTranslationPage" />
						<span class="slider round"></span>
					</label>
				</div>
				<div class="form-group flex">
					<label>{{ t('showWordTranslationIcon') }}:</label>
					<label class="switch">
						<input type="checkbox" v-model="showWordTranslationIcon" />
						<span class="slider round"></span>
					</label>
				</div>
			</div>
			<div class="actions">
				<button @click="saveSettings" class="btn-primary">{{ t('saveSetting') }}</button>
				<button @click="resetSettings" class="btn-reset">{{ t('resetDefault') }}</button>
			</div>
			<div v-if="saveStatus" class="status-message" :class="saveStatus.type">
				{{ saveStatus.message }}
			</div>
		</main>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { constantLanguages } from '../utils/constant'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()

	const localLanguage = ref('auto')
	const pageTranslationLanguage = ref('chinese_simplified')
	const showWordTranslationIcon = ref(false)
	const autoTranslationPage = ref(false)
	//自动翻译网站白名单
	const autoTranslationPageWhitelist = ref([])

	// 支持的语言列表
	const languages = constantLanguages
	const saveStatus = ref(null)

	//删除自动翻译网站白名单
	const removeWhitelist = (index) => {
		autoTranslationPageWhitelist.value.splice(index, 1)
	}

	const saveSettings = async () => {
		try {
			await chrome.storage.local.set({
				localLanguage: localLanguage.value,
				pageTranslationLanguage: pageTranslationLanguage.value,
				showWordTranslationIcon: showWordTranslationIcon.value,
				autoTranslationPage: autoTranslationPage.value,
				autoTranslationPageWhitelist: JSON.parse(JSON.stringify(autoTranslationPageWhitelist.value))
			})
			saveStatus.value = {
				type: 'success',
				message: t('settingSuccess')
			}
		} catch (error) {
			saveStatus.value = {
				type: 'error',
				message: t('settingFailed') + ': ' + error.message
			}
		}
		setTimeout(() => {
			saveStatus.value = null
		}, 1500)
	}

	const resetSettings = async () => {
		if (!confirm(t('confirmResetDefault'))) {
			return
		}
		localLanguage.value = 'chinese_simplified'
		pageTranslationLanguage.value = 'english'
		showWordTranslationIcon.value = false
		autoTranslationPage.value = false
		autoTranslationPageWhitelist.value = []
		await chrome.storage.local.set({
			localLanguage: localLanguage.value,
			pageTranslationLanguage: pageTranslationLanguage.value,
			showWordTranslationIcon: showWordTranslationIcon.value,
			autoTranslationPage: autoTranslationPage.value,
			autoTranslationPageWhitelist: JSON.parse(JSON.stringify(autoTranslationPageWhitelist.value))
		})
	}

	onMounted(async () => {
		const result = await chrome.storage.local.get([
			'localLanguage',
			'pageTranslationLanguage',
			'showWordTranslationIcon',
			'autoTranslationPage',
			'autoTranslationPageWhitelist'
		])
		if (result.localLanguage !== undefined) {
			localLanguage.value = result.localLanguage
		}
		if (result.pageTranslationLanguage !== undefined) {
			pageTranslationLanguage.value = result.pageTranslationLanguage
		}
		if (result.showWordTranslationIcon !== undefined) {
			showWordTranslationIcon.value = !!result.showWordTranslationIcon
		}
		if (result.autoTranslationPage !== undefined) {
			autoTranslationPage.value = !!result.autoTranslationPage
		}
		if (result.autoTranslationPageWhitelist !== undefined) {
			autoTranslationPageWhitelist.value = result.autoTranslationPageWhitelist || []
		}
	})
</script>
