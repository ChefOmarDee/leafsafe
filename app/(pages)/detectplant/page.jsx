"use client";
import React, { useState } from "react";
import { Upload, AlertTriangle, Skull } from "lucide-react";

const PlantDetectionApp = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
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
      setResult(data.result);
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
      setAdvice(data.advice);
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Plant Detection App</h1>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".png,.jpeg,.jpg,.tiff,.bmp"
          className="w-full p-2 border border-gray-300 rounded"
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
        className="w-full mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
        disabled={isLoading}
      >
        <Upload className="mr-2 h-4 w-4" />
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={isAdviceLoading}
          >
            {isAdviceLoading ? "Getting Advice..." : "Get Advice"}
          </button>
        </div>
      )}
      {advice && (
        <div className="mb-4 p-4 border rounded-md bg-yellow-100">
          <h2 className="text-lg font-semibold">Advice</h2>
          <p>{advice}</p>
        </div>
      )}
      {showNewPlantButton && (
        <button
          onClick={handleNewPlant}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Look Up New Plant
        </button>
      )}
    </div>
  );
};

export default PlantDetectionApp;
