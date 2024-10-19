const path = require("path");
const fs = require('fs');
const axios = require('axios');
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const apiKey = process.env.OPENAI_KEY;

export async function DetectPlant(imagePath) {
    let image;
    let base64Image;
    try {
        image = fs.readFileSync(imagePath);
        base64Image = image.toString('base64');
    } catch (err) {
        console.error('Error reading the image file:', err.message);
        throw err;
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };

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

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
        console.log("Response from OpenAI:", response.data.choices[0].message.content);
        const responseArr = response.data.choices[0].message.content.split(";");
        return responseArr;
    } catch (error) {
        console.error("Error uploading image:", error.response ? error.response.data : error.message);
        throw error;
    }
}