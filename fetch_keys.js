const fetch = require('node-fetch');

const LOKALISE_PROJECT_ID = '80351572643dbc04757402.77428165';
const LOKALISE_API_TOKEN = '2b79e8d9c9afcc8079881854855adc8d14878f6b';

async function fetchKeys() {
    console.log('Fetching keys...');
    const response = await fetch(`https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/keys?include_translations=1`, {
        method: 'GET',
        headers: {
            'X-Api-Token': LOKALISE_API_TOKEN
        }
    });

    if (!response.ok) {
        console.error('Failed:', await response.text());
        return;
    }

    const data = await response.json();
    console.log('Keys found:');
    data.keys.forEach((k) => {
        const translations = k.translations.map((t) => `[${t.language_iso}] ${t.translation}`).join(' | ');
        console.log(`- Key: ${k.key_name.web || k.key_name.other} | Val: ${translations}`);
    });
}

fetchKeys();
