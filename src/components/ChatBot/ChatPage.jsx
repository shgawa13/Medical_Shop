// src/pages/ChatPage.jsx
import { useState } from "react";
import ChatbotIcon from "./Chatbotlcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([
    { id: makeId(), role: "model", text: "How can I help you today?" },
  ]);

  const generateBotResponse = async (history) => {
    setChatHistory((prev) => [
      ...prev.filter((m) => m.text !== "Thinking..."),
      { id: makeId(), role: "model", text: "Thinking..." },
    ]);

    const payload = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || res.statusText);

      const reply = data.candidates[0].content.parts[0].text.trim();

      setTimeout(() => {
        setChatHistory((h) =>
          h
            .filter((m) => m.text !== "Thinking...")
            .concat({ id: makeId(), role: "model", text: reply })
        );
      }, 600);
    } catch {
      setChatHistory((h) =>
        h
          .filter((m) => m.text !== "Thinking...")
          .concat({ id: makeId(), role: "model", text: "Error." })
      );
    }
  };

  return (
    <div className="dev container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text text-2xl font-bold">Chatbot</h2>
          </div>
          <button className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>
        <div className="chat-body">
          {chatHistory.map((msg) => (
            <ChatMessage key={msg.id} chat={msg} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
