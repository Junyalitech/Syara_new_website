import { useState } from "react";
import "./LoginForm.css";
import { KeyRound, Smartphone } from "lucide-react";
import { OtpInput } from "./OtpInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authslice";
import { fetchUserCartAPI, replaceCart } from "../../features/cart/cartUtils";
import toast from "react-hot-toast";


interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void; // ✅ NEW
}

export const LoginForm = ({ onSwitchToSignup, onLoginSuccess }: LoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp" | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loginloading, setLoginloading] = useState(false);
  const [verifyButtonLoading,setVerifyButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  // ✅ form states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
  });
  // ✅ validation function
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const [sendotpLoading, setSendOtpLoading] = useState(false);

  // ================= PASSWORD LOGIN =================
  const handlePasswordLogin = async () => {
    let newErrors = {
      email: "",
      phone: "",
      password: "",
    };

    console.log("Validating:", { email, password });

    // if (!validateEmail(email)) {
    //   newErrors.email = "Enter a valid email";
    // }

    if (!validatePhone(phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      console.log("Before dispatch");
      setLoginloading(true)

      const res = await dispatch(
        loginUser({ phone, password })
      ).unwrap();



      console.log("Login success:", res);

      localStorage.setItem("syara", "true"); // optional

      localStorage.setItem("syaraid", res.user?.id); // optional
      const userId = res.user?.id;


      if (userId) {
        try {
          const serverCart = await fetchUserCartAPI({ userId });

          console.log("Fetched server cart:", serverCart);

          const updatedCart = replaceCart(serverCart);

          window.dispatchEvent(new Event("cartUpdated"));

          console.log("Cart after replacement:", updatedCart);
        } catch (cartErr) {
          console.error("Cart fetch failed:", cartErr);
          // optional: show toast instead of breaking flow
        }
        finally {
          onLoginSuccess();
        }
      }

      onLoginSuccess();

    } catch (err) {
      console.error("Login error:", err);
    }
    finally {
      setLoginloading(false);
      setPhone("");
      setPassword("");
    }
  };

  // ================= OTP FLOW =================
  const handleSendOtp = async () => {
    let newErrors = {
      email: "",
      phone: "",
      password: "",
    };


    if (!validatePhone(phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      setSendOtpLoading(true);

      // 🔥 Call backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login-send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Send OTP failed:", data.message);
        toast.error(data.message || "Failed to send OTP");
        return;
      }

      console.log("OTP sent:", data);

      // ✅ Move to OTP screen
      setOtpSent(true);

    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong");
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifyButtonLoading(true);
      // 👉 Call verify OTP API
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
        toast.error(res.message || "OTP verification failed");
        setVerifyButtonLoading(false);
        return;
      }

      localStorage.setItem("syara", "true"); // optional

      localStorage.setItem("syaraid", res.user?.id); // optional
      const userId = res.user?.id;


      if (userId) {
        try {
          const serverCart = await fetchUserCartAPI({ userId });

          console.log("Fetched server cart:", serverCart);

          const updatedCart = replaceCart(serverCart);

          window.dispatchEvent(new Event("cartUpdated"));

          console.log("Cart after replacement:", updatedCart);
        } catch (cartErr) {
          console.error("Cart fetch failed:", cartErr);
          // optional: show toast instead of breaking flow
        }
        finally {
          onLoginSuccess();
        }
      }

      onLoginSuccess();

    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
    finally{
      setVerifyButtonLoading(false)
    }
  };

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
              <p className="subtitle">Use your Phone Number and password</p>
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
          <p>Please fill your Phone Number and Password to Sign In.</p>
        </div>

        {/* <div className="signup-form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Your Email Address" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          {errors.email && <p className="error">{errors.email}</p>}
        </div> */}

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
          <p className="error" style={{ marginTop: "10px" }}>
            {error.message || error}
          </p>
        )}

        <button className="primary-btn" onClick={handlePasswordLogin} disabled={loading}>  {loginloading ? "Signing in..." : "Sign in"}</button>

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

          <button className="primary-btn" disabled={sendotpLoading} onClick={handleSendOtp}>
             {loading ? "Sending OTP..." : "Send OTP"}
          </button>           
        </>
      ) : (
        <div className="otp-section">
          <OtpInput onChangeOtp={setOtp} />
          <button className="primary-btn" onClick={handleVerifyOtp} disabled={otp.length !== 6 || verifyButtonLoading}>
            {verifyButtonLoading ? "Verifying..." : "Verify & Sign in"}
          </button>
          {/* <button className="secondary-btn" onClick={() => setOtpSent(false)}>
            Resend code
          </button> */}
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