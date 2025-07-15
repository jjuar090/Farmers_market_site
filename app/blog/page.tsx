// Import only what we need for basic functionality
// import Link from "next/link"; // Not needed for console display

// Add this directive at the very top of your file to make it a Client Component
"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react"; // Import useState and useEffect

// Interface for a simplified phone (not directly used here, but keeping for context)
interface phone {
  _id: number;
  title: string;
  brand: string;
  image: string;
}

// IMPORTANT: Never hardcode your API key directly in client-side code for production.
// Use environment variables like process.env.NEXT_PUBLIC_GEMINI_API_KEY.
// For demonstration, replacing 'AIzaSyDC3QzbikUVWce_tvEkot5FLURkyGVeWd8' with a placeholder.
// The provided key format is suspicious. Ensure it's a valid API key from Google Cloud/AI Studio.
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_ACTUAL_GEMINI_API_KEY"; // Replace with your actual key

const genAI = new GoogleGenerativeAI("AIzaSyDC3QzbikUVWce_tvEkot5FLURkyGVeWd8");

async function getAIExplanation(): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use 1.5-flash
    const result = await model.generateContent("Explain how AI works in a few words");
    const response = await result.response;
    const text = response.text();
    console.log("AI Explanation (from browser):", text); // This will log in the browser console
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to get AI explanation.";
  }
}

export default function GoogleGenAIComponent() { // Renamed for clarity
  const [response, setResponse] = useState<string>("loading");
  useEffect (() => {
    const fetchExplanation = async () => {
      const aiText = await getAIExplanation();
      setResponse(aiText);
    }
    fetchExplanation();
  },[])

  return (
    <div>
      <h1>Google Generative AI Test</h1>
      <p>This is a test of the Google Generative AI API</p>
      <p>AI Explanation: {response}</p>
      <p>AI Explanation: {response}</p> {/* Display the explanation */}
    </div>
  );
}