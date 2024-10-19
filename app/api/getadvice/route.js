import { NextResponse } from 'next/server';
import { GetAdvice } from '@/app/_lib/openai/getadvice';

export async function POST(request) {
  try {
    const { plantName, situation } = await request.json();

    // Log the received data (for debugging purposes)
    console.log("Received plant name:", plantName);
    console.log("Received situation:", situation);

    const adviceResponse = await GetAdvice(plantName, situation);

    // Parse the bullet points into an array
    const adviceArray = adviceResponse
        .split('-')
        .map(item => {
            // Replace spaces and hyphens in phone numbers to prevent splitting
            return item
            .replace(/\b(\d{1,3})[\s\-](\d{1,3})[\s\-](\d{1,4})\b/g, '($1) $2-$3')
            .replace(/\b(\d{1,3})[\-](\d{1,4})\b/g, '$1\u2011$2');  // Format 911
        })
        .map(item => item.trim())  // Trim whitespace
        .filter(item => item !== '');  // Remove any empty items

    // Structure the response
    const structuredAdvice = {
      advicePoints: adviceArray
    };

    return NextResponse.json({ advice: structuredAdvice }, { status: 200 });
  } catch (error) {
    console.error("Error in getadvice API:", error);
    return NextResponse.json({ error: "Failed to get advice" }, { status: 500 });
  }
}