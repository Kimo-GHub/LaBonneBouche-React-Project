import React, { useState, useEffect } from "react";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../../styles/Profile/Profile.css";
import defaultProfilePic from '../../images/Home-images/DefaultProfile.png';
import EditProfile from './EditProfile';
import PaymentMethod from './PaymentMethod';
import SavedCards from './SavedCards';

function Profile() {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePic);
  const [activeSection, setActiveSection] = useState("editProfile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => navigate("/login")).catch(console.error);
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    try {
      await deleteUser(auth.currentUser);
      navigate("/login");
    } catch (err) {
      console.error("Delete error", err);
    }
  };

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
          <li className="logout-btn" onClick={handleLogout}>Logout</li>
          <li className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete Account</li>
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
            <h2>Account Settings</h2>
            <button onClick={() => navigate("/")} className="delete-cancel-btn">Back to Home</button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete your account?</h3>
            <button onClick={handleDeleteAccount} className="delete-confirm-btn">Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="delete-cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
