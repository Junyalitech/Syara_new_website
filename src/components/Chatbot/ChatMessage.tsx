import { Bot, User } from "lucide-react";
import "./ChatMessage.css";

const ChatMessage = ({ text, isBot, animate }) => (
  <div className={`message-row ${isBot ? "bot" : "user"} ${animate ? "fade-in" : ""}`}>
    
    {isBot && (
      <div className="avatar bot-avatar">
        <Bot size={14} />
      </div>
    )}

    <div className={`message-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
      {text}
    </div>

    {!isBot && (
      <div className="avatar user-avatar">
        <User size={14} />
      </div>
    )}
    
  </div>
);

export default ChatMessage;