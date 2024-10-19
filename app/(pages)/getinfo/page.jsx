"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";
import Navbar from "@/app/comps/navbar";

const InfoPage = () => {
  const [zipCode, setZipCode] = useState("");
  const [season, setSeason] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/getinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode, season }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit information");
      }

      const data = await res.json();
      setResponse(data.info);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while fetching the information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-400 to-green-200">
      <Navbar />
      <div className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-center text-green-800">
              Poisonous Plants Info
            </h1>

            <div className="mb-6 p-4 border rounded-md bg-yellow-50">
              <h2 className="text-xl font-semibold mb-2 text-yellow-800">
                Emergency Contact
              </h2>
              <p className="text-gray-700">
                If you suspect poisoning, please call immediately:
                <strong className="block mt-2 text-red-600 text-lg">
                  1-800-222-1222
                </strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="season"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Season
                </label>
                <select
                  id="season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select a season</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out flex items-center justify-center"
                disabled={isLoading}
              >
                <Send className="mr-2 h-5 w-5" />
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>

            {response && (
              <div className="p-4 border rounded-md bg-gray-50">
                <h2 className="text-xl font-semibold mb-2 text-green-800">
                  Poisonous Plants in Your Area
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{response}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
