import { NextResponse } from "next/server";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";

// Configure environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const apiKey = process.env.OPENAI_KEY;

export async function GetAdvice(plantName, situation) {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${apiKey}`,
	};

	const payload = {
		model: "gpt-4-turbo-preview",
		messages: [
			{
				role: "system",
				content:
					"You are an expert botanist and medical professional. Provide concise, actionable advice for dealing with potential plant poisoning situations.",
			},
			{
				role: "user",
				content: `A person has encountered the poisonous plant "${plantName}". Their situation is: "${situation}". Provide 5 bullet points of advice for dealing with this situation. Each point should be a complete sentence and should not include a bullet point character.

Example of good output:
Seek immediate medical attention, even if symptoms are not yet present.
Do not induce vomiting unless specifically instructed by a medical professional.
Remove any remaining plant material from the mouth or skin, using gloves if possible.
Collect a sample of the plant for identification, but avoid further contact.
Monitor for symptoms such as nausea, vomiting, or difficulty breathing, and report these to medical staff.`,
			},
		],
		max_tokens: 300,
	};

	try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			payload,
			{ headers }
		);
		return response.data.choices[0].message.content.trim();
	} catch (error) {
		console.error(
			"Error calling OpenAI API:",
			error.response ? error.response.data : error.message
		);
		throw new Error("Failed to get advice from OpenAI");
	}
}
