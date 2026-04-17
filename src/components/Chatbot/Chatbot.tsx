import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ChatMessage from "./ChatMessage";
import QuickReplies from "./QuickReplies";
import "./Chatbot.css";

interface Message {
  text: string;
  isBot: boolean;
  id: number;
}

const responses = [
  {
    keywords: ["hello", "hi", "hey", "hii", "helo"],
    reply:
      "Hi! 👋 Welcome to Syara Retails.\n\nHow can I help you today?"
  },
  {
    keywords: ["syara", "about", "company"],
    reply:
      "Syara Retails provides high-quality products directly from Uttarakhand villages 🌿 and supports farmers.",
  },
  {
    keywords: ["delivery", "shipping", "time"],
    reply:
      "Your order will be delivered within 1-5 business days in Delhi-NCR 🚚",
  },
  {
    keywords: ["return", "refund", "exchange"],
    reply:
      "You can return products at delivery. After that, returns are allowed within 5 days at our outlet. Opened/perishable items are not eligible ❌",
  },
  {
    keywords: ["privacy", "data"],
    reply:
      "Your data is सुरक्षित and never shared. Payment details are not stored 🔐",
  },
  {
    keywords: ["contact", "support", "help"],
    reply:
      "Contact us at 📧 syararetail@gmail.com or 📞 +91-8826540148",
  },
  {
    keywords: [
      "login",
      "signin",
      "password",
      "forgot password",
      "reset password",
      "can't login",
      "cant login",
      "login issue"
    ],
    reply:
      "Facing login issues? Try resetting your password from the login page 🔐",
  },
  {
    keywords: ["signup", "register"],
    reply:
      "Click on Sign Up at top right to create your account ✨",
  },
  {
    keywords: ["order", "track", "where is my order", "order status", "order kaha hai"],
    reply: "You can check your order status in 'My Orders' section 📦",
  }
];

const getBotReply = (input) => {
  const msg = input.toLowerCase();

  let bestMatch = null;
  let maxScore = 0;

  for (const item of responses) {
    let score = 0;

    for (const keyword of item.keywords) {
      if (msg.includes(keyword)) {
        score++;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) return bestMatch.reply;

  return "Sorry, I didn’t understand. Please choose an option below or contact support 🙏";
};

let msgId = 0;

const getInitialMessages = () => [
  {
    text: "Hi! 👋 How can I help you today?",
    isBot: true,
    id: 0,
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);




  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text: text.trim(), isBot: false, id: msgId++ }]);
    setInput("");
    setShowQuickReplies(false);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);

      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        { text: reply, isBot: true, id: msgId++ },
      ]);

      // 👉 If not understood → show options again
      if (reply.includes("didn’t understand")) {
        setShowQuickReplies(true);
      }
    }, 1000);
  };

  const resetChat = () => {
    msgId = 1; // reset id counter
    setMessages(getInitialMessages());
    setInput("");
    setShowQuickReplies(true);
    setIsTyping(false);
  };

  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        resetChat();
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="chatbot-container" ref={chatRef}>
      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? "open" : "closed"}`}>

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">
              <Bot size={20} />
            </div>
            <div>
              <h3>Support Chat</h3>
              {/* <span className="chat-status">
            <span className="dot" />
            Online now
          </span> */}
            </div>
          </div>
          <button className="close-btn" onClick={(e) => {
             e.stopPropagation();
            if (isOpen) resetChat(); // reset when closing
            setIsOpen(!isOpen);
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="chat-messages">
          {messages.map((msg, i) => (
            <ChatMessage key={msg.id} text={msg.text} isBot={msg.isBot} />
          ))}
          {/* {showQuickReplies && <QuickReplies onSelect={sendMessage} />} */}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevents newline / default behavior
                sendMessage(input);
              }
            }}
          />
          <button onClick={() => sendMessage(input)}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button className="chat-toggle" onClick={(e) => {
         e.stopPropagation();
        if (isOpen) resetChat(); // reset when closing
        setIsOpen(!isOpen);
      }}>
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatBot;
