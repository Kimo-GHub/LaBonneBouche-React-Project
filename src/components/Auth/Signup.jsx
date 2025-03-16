
import React, { useState } from "react";
import { registerUser } from "../../Firebase/firebase"; // Your registerUser handles creating user with email+password
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth/AuthForm.css";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      await registerUser(email, password); // You can enhance registerUser to save firstName & lastName in Firestore
      navigate("/login");
    } catch (err) {
      // Handle duplicate email
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
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form-grid">

        {/* First & Last Name */}
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

        {/* Email & Password */}
        <div className="input-pair">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        {/* Password Strength Indicator */}
        <div className="password-strength">
          <progress value={strength} max="4"></progress>
          <ul className="password-rules">
            <li className={password.length >= 8 ? "valid" : ""}>Minimum 8 characters</li>
            <li className={/[A-Z]/.test(password) ? "valid" : ""}>At least one uppercase letter</li>
            <li className={/[0-9]/.test(password) ? "valid" : ""}>At least one number</li>
            <li className={/[^A-Za-z0-9]/.test(password) ? "valid" : ""}>At least one special character</li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="full-width-input">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      <div className="switch-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
