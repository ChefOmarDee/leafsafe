import { NextResponse } from "next/server";
import { GetAdvice } from "@/app/_lib/openai/getadvice";

export async function POST(request) {
	try {
		const { plantName, situation } = await request.json();

		if (!plantName || !situation) {
			return NextResponse.json(
				{ error: "Missing plantName or situation" },
				{ status: 400 }
			);
		}

		console.log("Received plant name:", plantName);
		console.log("Received situation:", situation);

		const adviceResponse = await GetAdvice(plantName, situation);

		// Split the response into an array of advice points
		const adviceArray = adviceResponse
			.split("\n")
			.map((point) => point.trim())
			.filter((point) => point.length > 0);

		const structuredAdvice = {
			advicePoints: adviceArray,
		};

		return NextResponse.json({ advice: structuredAdvice }, { status: 200 });
	} catch (error) {
		console.error("Error in getadvice API:", error);
		return NextResponse.json(
			{ error: "Failed to get advice" },
			{ status: 500 }
		);
	}
}
