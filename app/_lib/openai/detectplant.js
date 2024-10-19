const path = require("path");
const fs = require('fs');
const axios = require('axios'); // Ensure you install axios with npm install axios
const dotenv = require("dotenv");

// OpenAI API Key
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const apiKey = process.env.OPENAI_KEY;

export async function DetectPlant(imageName) {
// Path to your image
const imagePath = path.join(__dirname, '../photos', imageName);
// console.log(imagePath);
let image;
let base64Image;
try {
    image = fs.readFileSync(imagePath);
    base64Image = image.toString('base64');
    // console.log('Base64 Image:', base64Image);
} catch (err) {
    console.error('Error reading the image file:', err.message);
}
// Prepare headers for the API request
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
};

// Prepare the payload for the API request
const payload = {
    "model": "gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "tell me what the name of this plant, return 0 if it is edible, 1 if it is inedible, and 2 if it is poisonous. Give me my answer as a string where the first element is a string and the second is an int and they are separated by a ;, just the elements separated by the ; and that is all"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": `data:image/jpg;base64,${base64Image}`
                    }
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
        const responseArr = response.data.choices[0].message.content.split(";");
        return responseArr;
    })
    .catch(error => {
        console.error("Error uploading image:", error.response ? error.response.data : error.message);
    });
}