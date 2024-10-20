"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import Navbar from "@/app/comps/navbar";

const PlantDetectionApp = () => {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [result, setResult] = useState(null);
	const [plantName, setPlantName] = useState("");
	const [userInput, setUserInput] = useState("");
	const [advice, setAdvice] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isAdviceLoading, setIsAdviceLoading] = useState(false);
	const [showNewPlantButton, setShowNewPlantButton] = useState(false);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		const allowedTypes = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/tiff",
			"image/bmp",
			"image/jfif",
		];

		if (selectedFile && allowedTypes.includes(selectedFile.type)) {
			setFile(selectedFile);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			alert(
				"Please select a valid image file (.png, .jpeg, .jpg, .tiff, .bmp)"
			);
		}
	};

	const handleSubmit = async () => {
		if (!file) {
			alert("Please upload an image file");
			return;
		}

		setIsLoading(true);

		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await fetch("/api/detectplant", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Image upload and processing failed");
			}

			const data = await response.json();
			setResult(data.score);
			setPlantName(data.plantName);
		} catch (error) {
			console.error("Error:", error);
			alert(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAdviceRequest = async () => {
		if (!userInput) {
			alert("Please describe your situation before requesting advice.");
			return;
		}

		setIsAdviceLoading(true);

		try {
			const response = await fetch("/api/getadvice", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plantName: plantName,
					situation: userInput,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get advice");
			}

			const data = await response.json();
			setAdvice(data.advice.advicePoints);
			setShowNewPlantButton(true);
		} catch (error) {
			console.error("Error:", error);
			alert(error.message);
		} finally {
			setIsAdviceLoading(false);
		}
	};

	const handleNewPlant = () => {
		setFile(null);
		setPreview(null);
		setResult(null);
		setPlantName("");
		setUserInput("");
		setAdvice("");
		setShowNewPlantButton(false);

		// Clear the file input
		const fileInput = document.querySelector('input[type="file"]');
		if (fileInput) {
			fileInput.value = "";
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-green-400 to-green-200">
			<Navbar />
			<div className="flex-grow py-10">
				<div className="container mx-auto px-4">
					<div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
						<h1 className="text-2xl font-bold mb-6 text-center text-green-800">
							Plant Detection App
						</h1>
						<div className="mb-6">
							<input
								id="fileInput"
								type="file"
								onChange={handleFileChange}
								accept=".png,.jpeg,.jpg,.tiff,.bmp, .jpeg, .jfif"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out hover:border-gray-400 hover:shadow-md"
							/>
						</div>

						{preview && (
							<div className="mb-4">
								<img
									src={preview}
									alt="Plant preview"
									className="w-full rounded-lg"
								/>
							</div>
						)}
						<button
							onClick={handleSubmit}
							className="w-full mb-4 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center justify-center"
							disabled={isLoading}
						>
							<Upload className="mr-2 h-5 w-5" />
							{isLoading ? "Processing..." : "Upload and Detect"}
						</button>
						{result !== null && (
							<div className="mb-4 p-4 border rounded-md bg-gray-100">
								<h2 className="text-lg font-semibold">
									{result === 0 && "🍎 Edible"}
									{result === 1 && "🤢 Inedible"}
									{result === 2 && "☠️ Poisonous"}
								</h2>
								<p>
									Plant detected: <strong>{plantName}</strong>
								</p>
							</div>
						)}
						{result === 2 && !advice && (
							<div className="mb-4">
								<textarea
									placeholder="What happened? Describe your situation..."
									value={userInput}
									onChange={(e) => setUserInput(e.target.value)}
									className="w-full p-2 border border-gray-300 rounded mb-2"
									rows={4}
								/>
								<button
									onClick={handleAdviceRequest}
									className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out"
									disabled={isAdviceLoading}
								>
									{isAdviceLoading ? "Getting Advice..." : "Get Advice"}
								</button>
							</div>
						)}
						{advice && advice.length > 0 && (
							<div className="mb-4 p-4 border rounded-md bg-yellow-100">
								<h2 className="text-lg font-semibold mb-2">Advice</h2>
								<ul className="list-disc pl-5">
									{advice.map((point, index) => (
										<li key={index} className="mb-1">
											{point}
										</li>
									))}
								</ul>
							</div>
						)}
						{showNewPlantButton && (
							<button
								onClick={handleNewPlant}
								className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out"
							>
								Look Up New Plant
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlantDetectionApp;
