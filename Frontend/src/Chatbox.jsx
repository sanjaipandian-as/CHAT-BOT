import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = "AIzaSyDWkvd-O5HU7KdqaELqiCNu98Tz3MjsdPE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function ChatApp() {
    const geminifetch = async (prompt) => {
        try {
            const resp = await axios.post(API_URL, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            return resp.data?.candidates?.[0]?.content?.parts?.[0]?.text?.split('\n').map((line, index) => {
                if (line.trim().endsWith(':')) {
                    return `<strong>${line.trim()}</strong>`; // Convert section headings to bold
                }
                return `${line.trim()}`; // No bullet points
            }) || ["No response"];
        } catch (e) {
            console.error("Error fetching response:", e.response?.data || e.message);
            return ["Faced error Connecting"];
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
        const botMessage = { text: botResponse, sender: "bot" };

        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
    };

    return (
        <div className="bg-[#18122B] h-screen flex">
            <div className="w-[20%] h-full flex flex-col justify-between p-4 bg-[#1E1A36] text-white">
                <h1 className="text-5xl font-bold text-center mb-auto">Explore-TN AI</h1>
                <div className="flex flex-col items-center space-y-2 mb-4">
                    <p className="text-lg font-semibold">Username</p>
                    <p className="text-lg font-semibold">user@mail.com</p>
                    <button className="mt-2 px-4 py-2 bg-red-600 rounded-lg text-lg font-semibold">Logout</button>
                </div>
            </div>
            <div className="bg-[#1E1A36] flex flex-col p-4 rounded-lg shadow-lg w-[80%] h-full">
                <div className="flex-1 overflow-y-auto border border-gray-700 p-4 rounded-lg bg-[#242036] space-y-2">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                                {msg.text.map((line, i) => (
                                    <div key={i} className="text-lg font-medium" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*/g, '') }}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-center text-gray-400 animate-pulse text-lg">Loading...</div>}
                </div>
                <div className="mt-4 flex">
                    <input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type a message..." 
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
