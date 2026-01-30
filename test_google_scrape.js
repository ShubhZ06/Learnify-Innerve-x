const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeGoogle(query) {
    console.log(`\nScraping Google for: ${query}`);
    try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br', // Axios handles decompression usually, but good to mimic
                'Referer': 'https://www.google.com/'
            }
        });

        // console.log("Response status:", response.status);
        // console.log("Response length:", response.data.length);

        const $ = cheerio.load(response.data);
        const results = [];

        // Selectors change often, but usually .g contains results
        // Title: h3
        // Link: a href
        // Snippet: div array (multiple possible classes)

        $('div.g').each((i, element) => {
            const title = $(element).find('h3').text();
            const link = $(element).find('a').attr('href');
            const snippet = $(element).find('div[style*="-webkit-line-clamp"]').text() || $(element).find('div.VwiC3b').text();

            if (title && link && link.startsWith('http')) {
                results.push({ title, link, snippet });
            }
        });

        console.log(`Found ${results.length} results.`);
        if (results.length > 0) {
            console.log('First result:', results[0]);
        }
        return results;

    } catch (error) {
        console.error('Google Scrape failed:', error.message);
        if (error.response) console.log("Status:", error.response.status);
        return [];
    }
}

async function run() {
    await scrapeGoogle("Quantum Physics filetype:pdf");
    await scrapeGoogle("Latest Tech News");
}

run();
