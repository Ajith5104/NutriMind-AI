const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NutriMind AI",
    }
});

async function test() {
    try {
        console.log("Testing with key:", process.env.OPENAI_API_KEY.substring(0, 15) + "...");
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log("Success:", response.choices[0].message.content);
    } catch (error) {
        console.error("Test Failed:");
        console.error("Status:", error.status);
        console.error("Error Info:", error.error);
        console.error("Message:", error.message);
    }
}

test();
