import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile/Profile.css"; 
import defaultProfilePic from '../../assets/Home-images/DefaultProfile.png'; 

function Profile () {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePic);
  const [activeSection, setActiveSection] = useState("editProfile");
  const navigate = useNavigate();

  // Get current user from Firebase authentication
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setProfilePicture(currentUser.photoURL || defaultProfilePic);
    } else {
      navigate("/login"); // Redirect to login if no user is logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-pic-container">
          <img src={profilePicture} alt="Profile" className="profile-pic" />
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "editProfile" ? "active" : ""}
            onClick={() => setActiveSection("editProfile")}
          >
            Edit Profile
          </li>
          <li
            className={activeSection === "addPayment" ? "active" : ""}
            onClick={() => setActiveSection("addPayment")}
          >
            Add Payment Method
          </li>
          <li
            className={activeSection === "accountSettings" ? "active" : ""}
            onClick={() => setActiveSection("accountSettings")}
          >
            Account Settings
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="main-content">
        {activeSection === "editProfile" && (
          <div className="section">
            <h2>Edit Profile</h2>
            {/* Add Edit Profile form or details here */}
            <p>Update your profile information here.</p>
          </div>
        )}
        {activeSection === "addPayment" && (
          <div className="section">
            <h2>Add Payment Method</h2>
            {/* Add payment method form or details here */}
            <p>Add your payment method details here.</p>
          </div>
        )}
        {activeSection === "accountSettings" && (
          <div className="section">
            <h2>Account Settings</h2>
            {/* Add account settings options here */}
            <p>Manage your account settings here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
