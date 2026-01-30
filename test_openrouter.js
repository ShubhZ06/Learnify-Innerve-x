const axios = require('axios');

const API_KEY = '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';

async function generateData(topic) {
    console.log(`Generating AI data for: ${topic}`);
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            "model": "microsoft/phi-3-medium-128k-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": `Generate a detailed educational summary about "${topic}". Include key concepts, definitions, and a brief history. Format as plain text.`
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                "X-Title": "Learnify Student Project" // Required by OpenRouter
            }
        });

        const content = response.data.choices[0].message.content;
        console.log("\n--- Generated Content ---\n");
        console.log(content.substring(0, 500) + "...");
        return content;

    } catch (error) {
        console.error('OpenRouter Generation failed:', error.message);
        if (error.response) console.error("Response data:", error.response.data);
        return null;
    }
}

generateData("Photosynthesis");
