import enTranslations from "./i18n/en.json"
import faTranslations from "./i18n/fa.json"

type Translations = typeof enTranslations
type TranslationKey = keyof Translations

const translations: Record<"en" | "fa", Translations> = {
  en: enTranslations,
  fa: faTranslations,
}

export function getTranslation(locale: "en" | "fa", key: TranslationKey): string {
  return translations[locale][key] || key
}

export function useTranslation(locale: "en" | "fa") {
  return (key: TranslationKey) => getTranslation(locale, key)
}
