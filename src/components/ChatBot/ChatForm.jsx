import { useRef } from "react";
import PropTypes from "prop-types";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    const newMessage = { role: "user", text: userMessage };
    const updatedHistory = [...chatHistory, newMessage];

    setChatHistory(updatedHistory);
    generateBotResponse(updatedHistory);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message"
        className="message-input"
        required
      />   <Link to={"/"}>
              {" "}<FaHome className="ReturnToHomeChat" />   </Link>
      <button className="material-symbols-outlined">arrow_upward</button>
    </form>
  );
};

ChatForm.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  setChatHistory: PropTypes.func.isRequired,
  generateBotResponse: PropTypes.func.isRequired,
};

export default ChatForm;
