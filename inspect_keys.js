const fetch = require('node-fetch');

const LOKALISE_PROJECT_ID = '80351572643dbc04757402.77428165';
const LOKALISE_API_TOKEN = '2b79e8d9c9afcc8079881854855adc8d14878f6b';

async function inspectKeys() {
    console.log('Fetching keys to inspect platforms...');
    const response = await fetch(`https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/keys?limit=5`, {
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
    data.keys.forEach((k) => {
        console.log(`Key: ${k.key_name.web || k.key_name.other}`);
        console.log(`Platforms: ${JSON.stringify(k.platforms)}`);
    });
}

inspectKeys();
