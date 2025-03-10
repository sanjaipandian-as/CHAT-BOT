import React, { useState } from "react";
import axios from "axios";
// import LoadingSpinner from "./components/LoadingSpinner";
import LoadingSpinner from "./componants/LoadingSpinner";// Ensure correct path

const API_KEY = "AIzaSyDWkvd-O5HU7KdqaELqiCNu98Tz3MjsdPE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function ChatApp() {
    const geminifetch = async (prompt) => {
        try {
            const systemPrompt = "You are a Tamil Nadu Tourism AI. You will only provide information related to tourism, travel, places to visit, food, festivals, and cultural activities in Tamil Nadu. If a user asks for a trip plan, create a structured itinerary with proper formatting.";

            const requestBody = {
                contents: [
                    { role: "user", parts: [{ text: systemPrompt }] },
                    { role: "user", parts: [{ text: prompt }] },
                ],
            };

            const resp = await axios.post(API_URL, requestBody);

            let responseText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No relevant tourism data found.";

            responseText = responseText
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>
                .replace(/\*/g, "•") // Convert * bullet points to •
                .replace(/\n/g, "<br>"); // Convert new lines to <br>

            return responseText || ["No response"];
        } catch (e) {
            console.error("Error fetching response:", e.response?.data || e.message);
            return ["Error connecting to the AI server. Please try again."];
        }
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: [input], sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        setInput("");
        setLoading(true);

        const botResponse = await geminifetch(input);
        const botMessage = { text: [botResponse], sender: "bot" };

        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
    };

    return (
        <div className="bg-[#18122B] h-screen flex">
            {/* Sidebar */}
            <div className="w-[25%] h-full flex flex-col justify-between p-4 bg-[#1E1A36] text-white">
                <h1 className="text-4xl font-bold text-center mb-auto">Explore-TN AI</h1>
                
                {/* Emergency Numbers Section */}
                <div className="mt-6 bg-[#2D2A4A] p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Emergency Numbers</h2>
                    <p className="text-lg"><strong>Police:</strong> 100</p>
                    <p className="text-lg"><strong>Ambulance:</strong> 108</p>
                    <p className="text-lg"><strong>Fire & Rescue:</strong> 101</p>
                    <p className="text-lg"><strong>Tourist Helpline:</strong> 1800-425-3111</p>
                </div>

                <div className="flex flex-col items-center space-y-2 mt-6">
                    <p className="text-lg font-semibold">Username</p>
                    <p className="text-lg font-semibold">user@mail.com</p>
                    <button className="mt-2 px-4 py-2 bg-red-600 rounded-lg text-lg font-semibold">
                        Logout
                    </button>
                </div>
            </div>

            {/* Chat Section */}
            <div className="bg-[#1E1A36] flex flex-col p-4 rounded-lg shadow-lg w-[75%] h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto border border-gray-700 p-4 rounded-lg bg-[#242036] space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}
                            >
                                <div className="text-lg font-medium" dangerouslySetInnerHTML={{ __html: msg.text[0] }}></div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Loading Animation */}
                    {loading && (
                        <div className="flex justify-center items-center mt-4">
                            <LoadingSpinner />
                        </div>
                    )}
                </div>

                {/* Input Section */}
                <div className="mt-4 flex">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Tamil Nadu Tourism..."
                        className="flex-1 p-3 rounded-l-lg bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none text-lg"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-5 py-3 bg-[#7B61FF] text-white font-semibold rounded-r-lg hover:bg-[#6A51E6] text-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
