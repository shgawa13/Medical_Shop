import PropTypes from "prop-types";
import Chatbotlcon from "./Chatbotlcon";

const ChatMessage = ({ chat }) => {
  return (
    <div
      className={`message ${chat.role === "model" ? "bot" : "user"}-message`}
    >
      {chat.role === "model" && <Chatbotlcon />}
      <p className="message-text">{chat.text}</p>
    </div>
  );
};

ChatMessage.propTypes = {
  chat: PropTypes.shape({
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatMessage;
