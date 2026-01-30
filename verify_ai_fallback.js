const axios = require('axios');

async function verifyAI() {
    console.log("Testing AI Fallback...");
    try {
        // Search for a nonsense term to ensure no docs/wiki found
        const query = "Xyzzzz123456789NonExistentTopic";
        const response = await axios.get(`http://localhost:3000/api/library/search?q=${query}`, { timeout: 30000 });

        console.log("Status:", response.status);
        console.log("Resources Found:", response.data.resources.length);

        if (response.data.resources.length > 0) {
            const res = response.data.resources[0];
            console.log("First Resource:", res);

            if (res.subject === 'AI Generated') {
                console.log("SUCCESS: AI Generation triggered!");
                console.log("AI Content Length:", res.aiContent?.length);
            } else {
                console.log("FAILURE: Found resource but not AI generated.");
            }
        } else {
            console.log("FAILURE: No resources returned (AI fallback failed).");
        }
    } catch (e) {
        console.error("Verification failed:", e.message);
        if (e.code) console.error("Code:", e.code);
        if (e.response) console.error("Response:", e.response.status, e.response.statusText);
    }
}

verifyAI();
