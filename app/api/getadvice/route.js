import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { plantName, situation } = await request.json();

    // Log the received data (for debugging purposes)
    console.log("Received plant name:", plantName);
    console.log("Received situation:", situation);

    // In a real-world scenario, you might use this data to generate specific advice
    // For this example, we'll always return the same advice
    const advice = "Seek immediate medical attention.";

    return NextResponse.json({ advice }, { status: 200 });
  } catch (error) {
    console.error("Error in getadvice API:", error);
    return NextResponse.json({ error: "Failed to get advice" }, { status: 500 });
  }
}