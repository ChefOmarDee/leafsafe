import { NextResponse } from 'next/server';
import { GetInfo } from '@/app/_lib/openai/getinfo';

export async function POST(request) {
  try {
    const { zipCode, season } = await request.json();

    // Log the received data (for debugging purposes)
    console.log("Received zip code:", zipCode);
    console.log("Received season:", season);

    const infoResponse = await GetInfo(zipCode, season);

    return NextResponse.json({ info: infoResponse }, { status: 200 });
  } catch (error) {
    console.error("Error in getinfo API:", error);
    return NextResponse.json({ error: "Failed to get information" }, { status: 500 });
  }
}