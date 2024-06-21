// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './data/translations.json'; // Đường dẫn tới file translations.json

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: 'en', // Ngôn ngữ mặc định là tiếng Anh
    debug: true,
    fallbackLng: 'en',
    keySeparator: false, // Không sử dụng ký tự phân tách
    interpolation: {
      escapeValue: false // Không cần escape các giá trị
    }
  });

export default i18n;
