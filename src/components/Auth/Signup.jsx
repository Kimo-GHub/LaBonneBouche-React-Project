import React, { useState } from "react"; 
import { registerUser } from "../../Firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth/AuthForm.css";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(checkPasswordStrength(value));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (checkPasswordStrength(password) < 3) {
      setError("❌ Password must contain uppercase letters, numbers, and symbols.");
      return;
    }

    try {
      await registerUser(email, password, firstName, lastName, phoneNumber); // ✅ Pass phone number
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          <>
            This email is already registered.{" "}
            <Link to="/login" className="error-link">Click here to login.</Link>
          </>
        );
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#091a45",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        ← Back
      </button>

      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form-grid">
          <div className="input-pair">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-pair">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-pair">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="password-strength">
            <progress value={strength} max="4"></progress>
            <ul className="password-rules">
              <li className={password.length >= 8 ? "valid" : ""}>Minimum 8 characters</li>
              <li className={/[A-Z]/.test(password) ? "valid" : ""}>At least one uppercase letter</li>
              <li className={/[0-9]/.test(password) ? "valid" : ""}>At least one number</li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "valid" : ""}>At least one special character</li>
            </ul>
          </div>

          <button type="submit">Sign Up</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </>
  );
}
