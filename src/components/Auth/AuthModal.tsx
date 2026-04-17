import { useState } from "react";
import "./AuthModal.css";
import { LoginForm } from "./LoginForm";
import logo from '../../assets/Logo/logo.png'
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void; // ✅ ADD THIS
  onSignupSuccess: () => void; // ✅ ADD THIS

}

export const AuthModal = ({ open, onOpenChange, onLoginSuccess,  onSignupSuccess    }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (!open) return null;

  return (
    <div className="auth-overlay" onClick={() => onOpenChange(false)}>
      
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* CLOSE BUTTON */}
        <button className="auth-close" onClick={() => {onOpenChange(false);setMode('login')}}>
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
            <LoginForm onSwitchToSignup={() => setMode("signup")}  onLoginSuccess={onLoginSuccess}/>
          ) : (
            <SignupForm onSwitchToLogin={() => setMode("login")}  onSignupSuccess={onSignupSuccess}/>
          )}

        </div>
      </div>
    </div>
  );
};