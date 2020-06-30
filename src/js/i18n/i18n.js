import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './languages/cn.json';
import en from './languages/en.json';
import ja from './languages/ja.json';
import kr from './languages/kr.json';
import tw from './languages/tw.json';
import { ENABLE_CHANGE_LANGUAGE } from '../config';

i18n
  .on('languageChanged', lng => lng)
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      cn: { translations: ENABLE_CHANGE_LANGUAGE ? cn : ja },
      en: { translations: ENABLE_CHANGE_LANGUAGE ? en : ja },
      ja: { translations: ja },
      kr: { translations: ENABLE_CHANGE_LANGUAGE ? kr : ja },
      tw: { translations: ENABLE_CHANGE_LANGUAGE ? tw : ja },
    },
    fallbackLng: 'ja',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
