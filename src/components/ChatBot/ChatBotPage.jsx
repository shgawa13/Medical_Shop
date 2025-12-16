import { useState } from "react";
import ChatbotIcon from "./Chatbotlcon";// أيقونة البوت
import ChatForm from "./ChatForm"; // مكون لإرسال الرسائل
import ChatMessage from "./ChatMessage"; // مكون لعرض الرسائل

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const ChatBotPage = () => {
  // الحالة التي تخزن كل الرسائل
  const [chatHistory, setChatHistory] = useState([
    { id: makeId(), role: "model", text: "How can I help you today?" },
  ]);
//                                                    . تحديث الرد من البوت في الواجهة -   .API تستخدم لإرسال المحادثة السابقة إلى       generateBotResponse تعريف دالة 
// 
  const generateBotResponse = async (history) => {
    setChatHistory((prev) => [
      ...prev.filter((m) => m.text !== "Thinking..."),
      { id: makeId(), role: "model", text: "Thinking..." },
    ]);
// تحضير البيانات لإرسالها
    const payload = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      //                                                  .حماية  (VITE_API_ URL)  يتم اخذ رابط من متغير        (fetch باستخدام ) API الاتصال ب 
// بيانات مع بيانات (Post) يرسل
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: payload }),
      });

      const data = await res.json();
      console.log(data);
   // في حالة وجود خطأ من الخادم
      if (!res.ok) throw new Error(data.error?.message || res.statusText);

      const reply = data.candidates[0].content.parts[0].text.trim();
      // تحديث الرسائل بعد 600 مللي ثانية لإظهار الرد
      setTimeout(() => {
        setChatHistory((h) =>
          h
            .filter((m) => m.text !== "Thinking...")
            .concat({ id: makeId(), role: "model", text: reply })
            .filter((m) => m.text !== "Thinking...")
            .concat({ id: makeId(), role: "model", text: reply })
        );
      }, 600);
    } catch (error) {
      console.error("Error:", error); 
      //Error يتم عرض رسالة  API اذا فشل الاتصال ب 
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
            <h2 className="logo-text">Chatbot</h2>
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

export default ChatBotPage;
