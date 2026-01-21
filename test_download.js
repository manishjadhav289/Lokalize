const fetch = require('node-fetch');

const LOKALISE_PROJECT_ID = '80351572643dbc04757402.77428165';
const LOKALISE_API_TOKEN = '2b79e8d9c9afcc8079881854855adc8d14878f6b';

async function testDownload() {
    console.log('Testing download for "en"...');
    const apiUrl = `https://api.lokalise.com/api2/projects/${LOKALISE_PROJECT_ID}/files/download`;

    const body = {
        format: 'json',
        original_filenames: true,
        // bundle_structure: '%LANG_ISO%.json',
        // filter_langs: ['en'],
        // filter_platforms: ['web', 'ios', 'android', 'other'],
        // filter_data: ['translated', 'nonhidden', 'verified', 'unverified', 'reviewed', 'last_reviewed'],
    };
    
    console.log('Request Body:', JSON.stringify(body, null, 2));

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Token': LOKALISE_API_TOKEN,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error('❌ API Error Status:', response.status);
        const text = await response.text();
        console.error('❌ API Error Body:', text);
    } else {
        const data = await response.json();
        console.log('✅ API Success:', data);
    }
}

testDownload();
