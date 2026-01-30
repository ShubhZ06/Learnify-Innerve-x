const axios = require('axios');
const cheerio = require('cheerio');

async function searchDDG(query) {
    console.log(`Searching DDG for: ${query}`);
    try {
        const formData = new URLSearchParams();
        formData.append('q', query);

        const response = await axios.post('https://html.duckduckgo.com/html/', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        $('.result').each((i, element) => {
            const title = $(element).find('.result__a').text();
            const url = $(element).find('.result__a').attr('href');
            const snippet = $(element).find('.result__snippet').text();

            if (title && url) {
                results.push({ title, url, snippet });
            }
        });

        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('First result:', results[0]);
        }
        return results;

    } catch (error) {
        console.error('DDG Search failed:', error.message);
        return [];
    }
}

searchDDG("Quantum Physics filetype:pdf");
searchDDG("Latest Tech News");
