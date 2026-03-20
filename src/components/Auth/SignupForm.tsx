import { useState } from "react";
import "./SignupForm.css";
import { OtpInput } from "./OtpInput";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (step === 1) {
    return (
      <div className="signup-container">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Fill in your details to get started.</p>
        </div>

        <div className="step-indicator">
          <div className="active" />
          <div />
        </div>

        <div className="signup-form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Your Name" />
        </div>

        <div className="signup-form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Your Email Address" />
        </div>

        <div className="signup-form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="+91 0000-0000" />
        </div>

        <div className="signup-form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••••••" />
        </div>

        <button className="primary-btn" onClick={() => setStep(2)}>
          Continue
        </button>

        <p className="bottom-text">
          Already have an Account?
          <button onClick={onSwitchToLogin}>Sign-In here!</button>
        </p>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>Verify OTP</h2>
        <p>Enter the verification code sent to your email.</p>
      </div>

      <div className="step-indicator">
        <div />
        <div className="active" />
      </div>

      <div className="otp-section">
        <OtpInput />

        <button className="primary-btn">
          Verify & Create Account
        </button>

        <button className="secondary-btn">
          Resend code
        </button>
      </div>

      <button className="back-btn" onClick={() => setStep(1)}>
        ← Back
      </button>
    </div>
  );
};