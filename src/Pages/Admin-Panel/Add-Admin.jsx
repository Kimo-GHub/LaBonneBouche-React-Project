import React, { useState } from 'react';
import '../../styles/Admin/Add-Admin.css';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

const AddAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        role: 'admin',
        createdAt: serverTimestamp(),
      });

      setSuccessMsg(`Admin user (${email}) added successfully!`);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-container">
      <h2 className="admin-add-heading">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="admin-add-form">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="admin-add-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="admin-add-input"
        />
        <button type="submit" className="admin-add-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Admin'}
        </button>
      </form>

      {error && <p className="admin-add-error">{error}</p>}
      {successMsg && <p className="admin-add-success">{successMsg}</p>}
    </div>
  );
};

export default AddAdmin;
