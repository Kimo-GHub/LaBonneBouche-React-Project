import React, { useState, useEffect } from 'react';
import { supabase } from '../../Firebase/supabaseClient';
import {
  getAuth,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../images/Home-images/DefaultProfile.png';
import '../../styles/Profile/EditProfile.css';

function EditProfile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePic);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Password strength validation
  const passwordValidations = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    specialChar: /[^A-Za-z0-9]/.test(newPassword),
  };
  const isPasswordStrong = Object.values(passwordValidations).every(Boolean);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        setProfilePicture(currentUser.photoURL || defaultProfilePic);

        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
          }
        } catch (err) {
          setError('Failed to load user data.');
          console.error(err);
        }

        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Show preview immediately
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file || !user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.uid}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('la-bonne-bouche')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = await supabase.storage
        .from('la-bonne-bouche')
        .getPublicUrl(filePath);

      const publicURL = publicUrlData.publicUrl;

      await updateProfile(getAuth().currentUser, {
        photoURL: publicURL,
      });

      return publicURL;
    } catch (error) {
      setError(`Error uploading profile picture: ${error.message}`);
      return null;
    }
  };

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    const auth = getAuth();
    const db = getFirestore();

    try {
      let newPhotoURL = profilePicture;

      if (file) {
        const uploadedURL = await handleFileUpload();
        if (uploadedURL) {
          newPhotoURL = uploadedURL;
          setProfilePicture(uploadedURL); // Update with uploaded URL
        } else {
          return;
        }
      }

      if (firstName || lastName) {
        await updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
          photoURL: newPhotoURL,
        });
      }

      if (email !== user.email) {
        await auth.currentUser.updateEmail(email);
      }

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName,
        lastName,
        email,
      });

      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          setError('All password fields are required.');
          return;
        }

        if (newPassword !== confirmPassword) {
          setError('New password and confirmation do not match.');
          return;
        }

        if (!isPasswordStrong) {
          setError('Password must meet all strength requirements.');
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);

        await updatePassword(auth.currentUser, newPassword);
      }

      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);

      if (error.code === 'auth/wrong-password') {
        setError('Incorrect old password.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use.');
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please reauthenticate before making this change.');
      } else {
        setError(error.message || 'An error occurred while updating your profile.');
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="profile-pic-upload">
        <img src={profilePicture} alt="Profile" className="profile-pic" />

        {/* Styled file input */}
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose Profile Picture
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="profile-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Password strength feedback */}
        <div className="password-requirements">
          <p className={passwordValidations.length ? 'valid' : ''}>Minimum 8 characters</p>
          <p className={passwordValidations.uppercase ? 'valid' : ''}>At least one uppercase letter</p>
          <p className={passwordValidations.number ? 'valid' : ''}>At least one number</p>
          <p className={passwordValidations.specialChar ? 'valid' : ''}>At least one special character</p>
        </div>

        <button onClick={handleUpdate}>Update Profile</button>
      </div>
    </div>
  );
}

export default EditProfile;
