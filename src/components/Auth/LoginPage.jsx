import React, { useState } from "react";
import { loginUser } from "../../Firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import "../../styles/Auth/AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { user, role } = await loginUser(email, password);

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Check ban status
        if (userData.banned) {
          const now = new Date();

          if (
            userData.banEnd === "lifetime" ||
            new Date(userData.banEnd) > now
          ) {
            await signOut(getAuth());
            setError("You are currently banned from accessing the platform.");
            return;
          } else {
            // Ban has expired — remove it
            await updateDoc(userDocRef, {
              banned: false,
              banStart: "",
              banEnd: "",
            });
          }
        }

        // Redirect based on role
        const role = userData.role?.toLowerCase();
        if (role === "admin") {
          navigate("/admin-panel");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setResetMessage("");

    if (!resetEmail) {
      setError("Please enter your email to reset your password.");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Please check your inbox.");
      setShowResetModal(false);
      setResetEmail("");
    } catch (err) {
      setError("Failed to send reset email: " + err.message);
    }
  };

  return (
    <div className="auth-container" id="login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <div className="switch-link">
        Forgot your password?{" "}
        <span onClick={() => setShowResetModal(true)}>Reset Password</span>
      </div>

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleResetPassword}>Send Reset Email</button>
              <button onClick={() => setShowResetModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {resetMessage && <p className="success">{resetMessage}</p>}
      {error && <p className="error">{error}</p>}

      <div className="switch-link">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
