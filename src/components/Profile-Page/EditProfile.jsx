import React, { useState, useEffect } from 'react';
import { supabase } from '../../Firebase/Supabase';  // Import supabase client
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../assets/Home-images/DefaultProfile.png';  // Default profile image
import '../../styles/Profile/EditProfile.css';  // Assuming you have custom styles

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
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        setFirstName(currentUser.displayName.split(' ')[0] || ''); 
        setLastName(currentUser.displayName.split(' ')[1] || '');  
        setProfilePicture(currentUser.photoURL || defaultProfilePic);
      } else {
        navigate('/login');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    try {
      const filePath = `profile-pictures/${user.uid}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);
      if (error) {
        throw error;
      }
      const { publicURL } = await supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
      setProfilePicture(publicURL);
      await updateProfile(getAuth().currentUser, {
        photoURL: publicURL,
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setError('Error uploading file');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    const auth = getAuth();
    try {
      if (firstName || lastName) {
        await updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
        });
      }
      if (email !== user.email) {
        await auth.currentUser.updateEmail(email);
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setError('Error updating profile');
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && oldPassword && newPassword) {
      try {
        // Re-authenticate the user with their old password
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await user.updatePassword(newPassword);
        alert('Password updated successfully!');
      } catch (error) {
        console.error('Error updating password:', error.message);
        setError('Error updating password');
      }
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-pic-upload">
        <img src={profilePicture} alt="Profile" className="profile-pic" />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload New Profile Picture</button>
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

        <button onClick={handleProfileUpdate}>Update Profile</button>
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
    </div>
  );
}

export default EditProfile;
