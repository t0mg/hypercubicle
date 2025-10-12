import { DataLoader } from "./types";

let translations: any = {};

async function loadTranslations(lang: string, dataLoader: DataLoader): Promise<void> {
  try {
    translations = await dataLoader.loadJson(`locales/${lang}.json`);
  } catch (error) {
    console.warn(`Failed to load ${lang} translations:`, error);
    // Fallback to English if the desired language fails to load
    if (lang !== 'en') {
      await loadTranslations('en', dataLoader);
    }
  }
}

function getLanguage(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.split('-')[0];
  }
  return 'en';
}

export function t(key: string, replacements: Record<string, string | number> = {}): string {
  const keys = key.split('.');
  let text = keys.reduce((obj, i) => (obj ? obj[i] : undefined), translations);

  if (!text) {
    console.warn(`Translation not found for key: ${key}`);
    return key;
  }

  for (const placeholder in replacements) {
    text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
  }

  return text;
}

export async function initLocalization(dataLoader: DataLoader): Promise<void> {
  const lang = getLanguage();
  await loadTranslations(lang, dataLoader);
}
