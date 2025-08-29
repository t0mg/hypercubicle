let translations: any = {};

async function loadTranslations(lang: string) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not load ${lang}.json`);
        }
        translations = await response.json();
    } catch (error) {
        console.warn(`Failed to load ${lang} translations:`, error);
        // Fallback to English if the desired language fails to load
        if (lang !== 'en') {
            await loadTranslations('en');
        }
    }
}

function getLanguage() {
    return navigator.language.split('-')[0];
}

export function t(key: string, replacements: Record<string, string | number> = {}): string {
    const keys = key.split('.');
    let text = keys.reduce((obj, i) => (obj ? obj[i] : null), translations);

    if (!text) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
    }

    for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
    }

    return text;
}

export async function initLocalization() {
    const lang = getLanguage();
    await loadTranslations(lang);
}
