import { createI18n } from "vue-i18n";
import {languages} from '@/i18n/index'
import { defaultLocale } from "@/i18n/index";


const messages = Object.assign(languages)
const localLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ru'

const i18n = createI18n({
	locale: localLang,
	fallbackLocale: defaultLocale,
	legacy: false,
	globalInjection: true,
	messages,
});

export default i18n;