const path = require("path");
const axios = require('axios');
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const apiKey = process.env.OPENAI_KEY;

export async function GetInfo(zipcode, season) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

    const payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": `Given a zip code and a season (spring, summer, fall, or winter), provide the top 5 most common poisonous plants found in that area during that season. Please consider local flora and provide any relevant details about each plant's toxicity. For example, if the input is '33064' for spring, list the poisonous plants specific to that area during that season, along with brief descriptions of their toxicity.
                Input Format:
                Zip code: ${zipcode}
                Season: ${season}
                Expected Output Format:
                Plant Name (Scientific Name) - Brief description of toxicity.
                Plant Name (Scientific Name) - Brief description of toxicity.
                Plant Name (Scientific Name) - Brief description of toxicity.
                Plant Name (Scientific Name) - Brief description of toxicity.
                Plant Name (Scientific Name) - Brief description of toxicity.`
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