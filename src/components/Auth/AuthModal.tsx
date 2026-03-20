import { useState } from "react";
import "./AuthModal.css";
import { LoginForm } from "./LoginForm";
import logo from '../../assets/Logo/logo.png'
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (!open) return null;

  return (
    <div className="auth-overlay" onClick={() => onOpenChange(false)}>
      
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* CLOSE BUTTON */}
        <button className="auth-close" onClick={() => onOpenChange(false)}>
          ✕
        </button>

        {/* CONTENT */}
        <div className="auth-content">

          {/* LOGO */}
          <div className="auth-logo">
            <img src={logo} alt="logo" />
          </div>

          {/* FORM SWITCH */}
          {mode === "login" ? (
            <LoginForm onSwitchToSignup={() => setMode("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode("login")} />
          )}

        </div>
      </div>
    </div>
  );
};