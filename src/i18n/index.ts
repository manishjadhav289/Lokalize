import i18n, { BackendModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import JSZip from 'jszip';
import { LOKALISE_PROJECT_ID, LOKALISE_API_TOKEN } from '@env';

console.log('🚀 i18n/index.ts is loading...');

// Custom backend to fetch from Lokalise API
const LokaliseBackend: BackendModule = {
    type: 'backend',
    init: () => {
        console.log('🔧 LokaliseBackend initialized');
    },
    read: async (language: string, namespace: string, callback: (err: any, data: any) => void) => {
        try {
            // Sanitize language code to 2 chars (Lokalise usually uses 'en', 'es', etc.)
            const langIso = language.split('-')[0]; 
            console.log(`🔄 Fetching translations for '${langIso}' (requested: '${language}') from Lokalise /keys endpoint...`);

            // Use /keys endpoint to get raw keys and translations
            const apiUrl = `https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/keys?include_translations=1&limit=5000`;

            console.log('📍 API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Token': LOKALISE_API_TOKEN,
                },
            });

            console.log('📡 API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', errorText);
                callback(new Error(`API failed: ${response.status} ${errorText}`), null);
                return;
            }

            const data = await response.json() as any;
            console.log(`✅ API Response: ${data.keys?.length || 0} keys fetched`);

            if (!data.keys || !Array.isArray(data.keys)) {
                 console.error('❌ No keys found in response');
                 callback(new Error('No keys found'), null);
                 return;
            }

            // Transform keys into { key: value } map for the requested language
            const translations: Record<string, string> = {};
            
            data.keys.forEach((keyObj: any) => {
                const keyName = keyObj.key_name.web || keyObj.key_name.other || keyObj.key_name.ios || keyObj.key_name.android;
                
                // Find translation for the requested language
                const translationObj = keyObj.translations.find((t: any) => t.language_iso === langIso);
                
                if (keyName && translationObj && translationObj.translation) {
                    translations[keyName] = translationObj.translation;
                }
            });

            console.log(`✅ Parsed ${Object.keys(translations).length} translations for ${langIso}`);
            console.log(`📝 Sample keys:`, Object.keys(translations).slice(0, 5));
            callback(null, translations);

        } catch (error) {
            console.error('❌ Error:', error);
            callback(error, null);
        }
    },
};

i18n
    .use(LokaliseBackend)
    .use(initReactI18next)
    .init({
        debug: true,
        lng: RNLocalize.getLocales()[0].languageCode,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

console.log('✅ i18next initialized');

export default i18n;
