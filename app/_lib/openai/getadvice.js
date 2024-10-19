const path = require("path");
const fs = require('fs');
const axios = require('axios'); // Ensure you install axios with npm install axios
const dotenv = require("dotenv");

// OpenAI API Key
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const apiKey = process.env.OPENAI_KEY;

export async function GetAdvice(plant, event) {
// Prepare headers for the API request
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
};

// Prepare the payload for the API request
const payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Here's the plant: "+plant+", what should i do in this instance and what phone number should I call: "+ event +", only return the bullet points"
                }
            ]
        }
    ],
    "max_tokens": 300
};

// Send the request to the OpenAI API
axios.post('https://api.openai.com/v1/chat/completions', payload, { headers })
    .then(response => {
        console.log("Response from OpenAI:", response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    })
    .catch(error => {
        console.error("Error uploading image:", error.response ? error.response.data : error.message);
    });
}