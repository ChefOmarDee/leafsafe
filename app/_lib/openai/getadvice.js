const path = require("path");
const axios = require('axios');
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const apiKey = process.env.OPENAI_KEY;

export async function GetAdvice(plant, event) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `Here's the plant: ${plant}, what should i do in this instance and what phone number should I call: ${event}, only return the bullet points`
                    }
                ]
            }
        ],
        "max_tokens": 300
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
        console.log("Response from OpenAI:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}