import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../styles/Profile/Profile.css";
import defaultProfilePic from '../../images/Home-images/DefaultProfile.png';
import EditProfile from './EditProfile';
import PaymentMethod from './PaymentMethod';
import SavedCards from './SavedCards';
import ProfileSettings from "./ProfileSettings";

function Profile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePic);
  const [activeSection, setActiveSection] = useState("editProfile");
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      setProfilePicture(currentUser.photoURL || defaultProfilePic);

      const fetchCustomerId = async () => {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().customerId) {
          setCustomerId(snap.data().customerId);
        }
      };

      fetchCustomerId();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-pic-container">
          <img src={profilePicture} alt="Profile" className="profile-pic" />
          {user && <h3 className="profile-name">{user.displayName || "User"}</h3>}
        </div>
        <ul className="sidebar-menu">
          <li className={activeSection === "editProfile" ? "active" : ""} onClick={() => setActiveSection("editProfile")}>Edit Profile</li>
          <li className={activeSection === "addPayment" ? "active" : ""} onClick={() => setActiveSection("addPayment")}>Add Payment Method</li>
          <li className={activeSection === "accountSettings" ? "active" : ""} onClick={() => setActiveSection("accountSettings")}>Account Settings</li>
          <li className="home-btn" onClick={() => navigate("/")}>Home</li>
        </ul>
      </div>

      <div className="main-content">
        {activeSection === "editProfile" && (
          <div className="section">
            <EditProfile />
          </div>
        )}
        {activeSection === "addPayment" && (
          <div className="section">
            <PaymentMethod customerId={customerId} />
            <SavedCards customerId={customerId} />
          </div>
        )}
        {activeSection === "accountSettings" && (
          <div className="section">
            <ProfileSettings />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
