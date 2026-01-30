/* eslint-disable */
const googlethis = require('googlethis');

async function testRouteLogic(query) {
    console.log(`\n--- Testing Query: "${query}" ---`);

    // 1. Search for Documents
    const docQuery = query;
    console.log(`Step 1: Simple Search -> ${docQuery}`);

    let docResults = [];
    try {
        const docResponse = await googlethis.search(docQuery); // No options
        console.log("Raw docResponse:", docResponse);
        docResults = docResponse.results || [];
        console.log(`Found ${docResults.length} doc results.`);
    } catch (e) {
        console.error("Doc search failed:", e);
    }

    let resources = [];

    // Helper to determine type
    const getType = (url) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.endsWith('.pdf')) return 'pdf';
        if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) return 'ppt';
        if (lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx')) return 'doc';
        return 'link';
    };

    if (docResults) {
        resources = docResults.map((result) => ({
            id: result.url,
            title: result.title,
            type: getType(result.url),
            link: result.url
        }));
    }

    console.log(`Resources after Doc Search: ${resources.length}`);
    resources.forEach(r => console.log(` - [${r.type}] ${r.title} (${r.link})`));

    // 2. Fallback Check
    if (resources.length < 5) {
        console.log(`Step 2: Fallback Triggered (Count ${resources.length} < 5)`);

        // Image Search
        let topicImage = '';
        try {
            console.log("Searching for images...");
            const imageResponse = await googlethis.image(query, { safe: false });
            if (imageResponse.length > 0) {
                topicImage = imageResponse[0].url;
                console.log(`Found top image: ${topicImage}`);
            } else {
                console.log("No images found.");
            }
        } catch (e) {
            console.log('Image search failed', e.message);
        }

        // Web Search
        try {
            console.log("Searching for general info...");
            const generalResponse = await googlethis.search(query, options);

            if (generalResponse.results) {
                const newResults = generalResponse.results
                    .filter(r => !resources.find(res => res.id === r.url))
                    .map((result, index) => ({
                        title: result.title,
                        type: 'link',
                        isWeb: true,
                        imageUrl: index === 0 ? topicImage : undefined
                    }));

                console.log(`Adding ${newResults.length} web results.`);
                if (newResults.length > 0) {
                    console.log(`First web result image: ${newResults[0].imageUrl}`);
                }
                resources = [...resources, ...newResults];
            }
        } catch (e) {
            console.error("Web search failed:", e);
        }
    } else {
        console.log(`Step 2: Skipped (Count ${resources.length} >= 5)`);
    }

    console.log(`Final Resource Count: ${resources.length}`);
}

async function run() {
    await testRouteLogic("Quantum Physics"); // Likely to have docs
    await testRouteLogic("djfhadskjfhkjadsfh"); // Likely no docs
    await testRouteLogic("Latest Tech News"); // Likely no PDFs, should trigger fallback
}

run();
