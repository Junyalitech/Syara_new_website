import { useState } from "react";
import "./LoginForm.css";
import { KeyRound, Smartphone } from "lucide-react";
import { OtpInput } from "./OtpInput";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp" | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  if (loginMethod === null) {
    return (
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Choose how you'd like to sign in.</p>
        </div>

        <div className="login-options">
          <button className="login-card" onClick={() => setLoginMethod("password")}>
            <div className="icon-box">
              <KeyRound size={20} />
            </div>
            <div>
              <p className="title">Login with Password</p>
              <p className="subtitle">Use your phone and password</p>
            </div>
          </button>

          <button className="login-card" onClick={() => setLoginMethod("otp")}>
            <div className="icon-box">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="title">Login with OTP</p>
              <p className="subtitle">We'll send a code to your phone</p>
            </div>
          </button>
        </div>

        <p className="bottom-text">
          Don't have an Account?
          <button onClick={onSwitchToSignup}>Sign-Up here!</button>
        </p>
      </div>
    );
  }

  if (loginMethod === "password") {
    return (
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Please fill in your Phone and Password to Sign In.</p>
        </div>

        <div className="signup-form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="Your Phone Number" />
        </div>

        <div className="signup-form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••••••" />
        </div>

        <button className="primary-btn">Sign in</button>

        <div className="footer-row">
          <button onClick={() => setLoginMethod(null)}>← Back</button>
          <button onClick={onSwitchToSignup} className="link-btn">
            Sign-Up here!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>{otpSent ? "Enter OTP" : "Login with OTP"}</h2>
        <p>
          {otpSent
            ? "We sent a verification code to your Phone Number."
            : "Enter your Phone Number to receive a one-time code."}
        </p>
      </div>

      {!otpSent ? (
        <>
          <div className="signup-form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="Your Phone Number" />
          </div>

          <button className="primary-btn" onClick={() => setOtpSent(true)}>
            Send OTP
          </button>
        </>
      ) : (
        <div className="otp-section">
          <OtpInput />
          <button className="primary-btn">Verify & Sign in</button>
          <button className="secondary-btn" onClick={() => setOtpSent(false)}>
            Resend code
          </button>
        </div>
      )}

      <div className="footer-row">
        <button onClick={() => { setLoginMethod(null); setOtpSent(false); }}>
          ← Back
        </button>
        <button onClick={onSwitchToSignup} className="link-btn">
          Sign-Up here!
        </button>
      </div>
    </div>
  );
};