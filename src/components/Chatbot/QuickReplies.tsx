import { Package, RotateCcw, CreditCard } from "lucide-react";
import "./QuickReplies.css";

const quickOptions = [
  { text: "Track Order", icon: Package },
  { text: "Return", icon: RotateCcw },
  { text: "Payment Issue", icon: CreditCard },
];

const QuickReplies = ({ onSelect }) => (
  <div className="quick-replies">
    {quickOptions.map(({ text, icon: Icon }) => (
      <button
        key={text}
        onClick={() => onSelect(text)}
        className="quick-btn"
      >
        <Icon size={13} />
        {text}
      </button>
    ))}
  </div>
);

export default QuickReplies;