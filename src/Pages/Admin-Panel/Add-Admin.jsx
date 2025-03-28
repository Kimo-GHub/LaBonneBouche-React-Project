import React, { useState } from 'react';
import '../../styles/Profile/EditProfile.css';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

function AddAdmin() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password || !firstName || !lastName || !confirmPassword || !role) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!isPasswordStrong) {
      setError('Please meet all password strength requirements.');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await setDoc(doc(db, 'users', uid), {
        email,
        firstName,
        lastName,
        role,
        createdAt: serverTimestamp(),
      });

      setSuccessMsg(`User (${email}) created successfully with role "${role}"!`);

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setRole('admin');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Add New User</h2>

      {error && <p className="error-message">{error}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="password-requirements">
          <p className={passwordValidations.length ? 'valid' : ''}>Minimum 8 characters</p>
          <p className={passwordValidations.uppercase ? 'valid' : ''}>At least one uppercase letter</p>
          <p className={passwordValidations.number ? 'valid' : ''}>At least one number</p>
          <p className={passwordValidations.specialChar ? 'valid' : ''}>At least one special character</p>
        </div>

        <div>
          <label>Role</label>
          <select
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
            className="role-selector"
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export default AddAdmin;
