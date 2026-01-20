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
            console.log(`🔄 Fetching ${language} translations from Lokalise API...`);

            // Step 1: Request file download from Lokalise API
            const apiUrl = `https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/files/download`;

            console.log('📍 API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Token': LOKALISE_API_TOKEN,
                },
                body: JSON.stringify({
                    format: 'json',
                    original_filenames: false,
                    bundle_structure: '%LANG_ISO%.json',
                    filter_langs: [language],
                }),
            });

            console.log('📡 API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', errorText);
                callback(new Error(`API failed: ${response.status}`), null);
                return;
            }

            const data = await response.json();
            console.log('✅ API Response:', JSON.stringify(data).substring(0, 300));

            if (!data.bundle_url) {
                console.error('❌ No bundle_url in response');
                callback(new Error('No bundle_url'), null);
                return;
            }

            // Step 2: Download the bundle (it's a ZIP file)
            console.log('📦 Downloading bundle from:', data.bundle_url);

            const bundleResponse = await fetch(data.bundle_url);
            const arrayBuffer = await bundleResponse.arrayBuffer();

            console.log('✅ Bundle downloaded, size:', arrayBuffer.byteLength);

            // Step 3: Extract the ZIP file
            console.log('📂 Extracting ZIP file...');
            const zip = await JSZip.loadAsync(arrayBuffer);

            // Find the JSON file for this language
            const jsonFileName = `${language}.json`;
            console.log('🔍 Looking for:', jsonFileName);

            const files = Object.keys(zip.files);
            console.log('📁 Files in ZIP:', files);

            let translationData: any = null;

            for (const fileName of files) {
                if (fileName.endsWith('.json')) {
                    console.log('📄 Found JSON file:', fileName);
                    const content = await zip.files[fileName].async('string');
                    console.log('📄 Content:', content.substring(0, 300));
                    translationData = JSON.parse(content);
                    break;
                }
            }

            if (translationData) {
                console.log('✅ Parsed translations:', translationData);
                callback(null, translationData);
            } else {
                console.error('❌ No JSON file found in ZIP');
                callback(new Error('No JSON file in ZIP'), null);
            }

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
