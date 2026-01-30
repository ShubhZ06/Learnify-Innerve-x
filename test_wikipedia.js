const axios = require('axios');

async function searchWikipedia(query) {
    console.log(`Searching Wikipedia for: ${query}`);
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Learnify-Student-Project/1.0 (contact@example.com)'
            }
        });

        const results = response.data.query.search;
        console.log(`Found ${results.length} results.`);

        if (results.length > 0) {
            console.log("First result:", results[0]);
            // Construct link: https://en.wikipedia.org/?curid=PAGEID
        }
        return results;

    } catch (error) {
        console.error('Wikipedia Search failed:', error.message);
        return [];
    }
}

searchWikipedia("Quantum Physics");
searchWikipedia("Latest Tech News");
