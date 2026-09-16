import { useState } from "react";
import "./SignupForm.css";
import { OtpInput } from "./OtpInput";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authslice";
import { fetchUserCartAPI, replaceCart } from "../../features/cart/cartUtils";
import { createCartAPI } from "../../features/cart/cartSlice";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupForm = ({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verifyButtonLoading, setVerifyButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  // ✅ form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ validators
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // ================= STEP 1 VALIDATION =================
  const handleContinue = async () => {
    let newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
    };

    if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    // 👉 call API to send OTP (optional)
    try {
      setRegisterLoading(true);
      const res = await dispatch(registerUser({ name, email, phone, password, role: 'customer' })).unwrap();

      console.log("Signup success:", res);

      setStep(2); // OTP step

    } catch (err) {
      console.error("Signup error:", err);
    }
    finally {
      setRegisterLoading(false);
    }
  };

  // ================= OTP VERIFY =================
  const handleVerify = async () => {
    try {
      // 👉 Call verify OTP API
      setVerifyButtonLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone, // make sure this variable exists
          otp: otp,     // make sure this variable exists
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        console.error("OTP verification failed:", res.message);
        setVerifyButtonLoading(false)
        return;
      }

      console.log("Signup success", res);

      // ✅ Store auth flag
      localStorage.setItem("syara", "true");

      // ✅ Store user ID
      const userId = res.user?.id;
      localStorage.setItem("syaraid", userId);

      // 🔥 Fetch user cart
      let serverCart = await fetchUserCartAPI(userId);
      console.log("Fetched server cart:", serverCart);

      // 🔥 If no cart → create new cart
      if (!serverCart || serverCart.length === 0) {
        console.log("No cart found → creating new cart");

        const newCart = await dispatch(
          createCartAPI({
            userId,
            Product1: null,
            Pro_Qty1: 0,
            subtotal: 0,
            tax: 0,
            Grand_Total: 0,
            payment_status: "Pending",
            Shipping_street: "Default Street",
            Shipping_city: "Default City",
            Shipping_pincode: "000000",
            Shipping_state: "Default State",
            Shipping_country: "Default Country",
            Shipping_contact: "1234567890",
            Shipping_person_name: "User",
          })
        ).unwrap();

        console.log("New Cart Created:", newCart);

        serverCart = [];
      }

      // 🔥 Replace local cart
      const updatedCart = replaceCart(serverCart);

      window.dispatchEvent(new Event("cartUpdated"));

      console.log("Cart after replacement:", updatedCart);

      onSignupSuccess();

    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
    finally{
      setVerifyButtonLoading(false);
    }
  };


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
          <input type="text" placeholder="Your Name" value={name}
            onChange={(e) => {
              const value = e.target.value;
              // ✅ allow only letters & spaces
              if (/^[A-Za-z\s]*$/.test(value)) {
                setName(value);
              }
            }} />

          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="signup-form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Your Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="signup-form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="+91 0000-0000" value={phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value;
              // ✅ allow only digits
              if (/^\d*$/.test(value)) {
                setPhone(value);
              }
            }} />

          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="signup-form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {error && (
          <p className="error">
            {error.message || error}
          </p>
        )}

        <button className="primary-btn" onClick={handleContinue} disabled={registerLoading}>
          {registerLoading ? "Creating account..." : "Sign Up"}
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
        <p>Enter the verification code sent to your phone.</p>
      </div>

      <div className="step-indicator">
        <div />
        <div className="active" />
      </div>

      <div className="otp-section">
        <OtpInput onChangeOtp={setOtp} />

        <button
          className="primary-btn"
          onClick={handleVerify}
          disabled={otp.length !== 6 || verifyButtonLoading}
        >
          {verifyButtonLoading ? "Verifying..." : "Verify & Create Account"}
        </button>

        {/* <button className="secondary-btn">
          Resend code
        </button> */}
      </div>

      <button className="back-btn" >
        ← Back
      </button>
    </div>
  );
};