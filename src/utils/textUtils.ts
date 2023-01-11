export enum LanguageCode {
  en = "en",
  de = "de",
  it = "it",
}

class TextUtils {
  static getText(
    text: string,
    languageCode: LanguageCode,
    defaultLanguageCode: LanguageCode = LanguageCode.en
  ) {
    const allTexts = text.split("<");

    let translatedText = "";
    let defaultTranslation = "";

    for (let translation of allTexts) {
      if (translation.startsWith(languageCode)) {
        translatedText = translation.substring(languageCode.length + 1);
      }
      if (translation.startsWith(defaultLanguageCode)) {
        defaultTranslation = translation.substring(languageCode.length + 1);
      }
    }

    if (translatedText === "") {
      return defaultTranslation;
    }

    return translatedText;
  }

  static getTranslations(text: string) {}
}

export default TextUtils;
