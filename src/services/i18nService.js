// ============================================================
//  PathForge — Multilingual i18n Service (EN, TE, HI)
// ============================================================

import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

const LOCALES = { en, te, hi };

export function getTranslation(keyPath, lang = "en") {
  const selectedLang = LOCALES[lang] ? lang : "en";
  const localeObj = LOCALES[selectedLang];
  const keys = keyPath.split(".");

  let current = localeObj;
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to English
      let fallback = LOCALES.en;
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      return typeof fallback === "string" ? fallback : keyPath;
    }
  }

  return typeof current === "string" ? current : keyPath;
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", label: "English" },
  { code: "te", name: "తెలుగు", label: "Telugu (తెలుగు)" },
  { code: "hi", name: "हिन्दी", label: "Hindi (हिन्दी)" },
];
