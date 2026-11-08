import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AttendeeProfile.css";

export default function AttendeeProfile() {
  const navigate = useNavigate();

  // ✅ USER FROM LOCAL STORAGE (backend login)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ✅ Navigate to profile page (main profile view)
  const handleEditProfile = () => {
    navigate("/profilepage?role=attendee");
  };

  // ✅ Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate("/attendee/dashboard");
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <motion.div className="profile-card">
          <div className="avatar-box">!</div>
          <div className="info">
            <div className="name">No Data Found</div>
            <div className="role">Please login again</div>
            <button className="edit-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* AVATAR */}
        <div className="avatar-box">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>

        <div className="info">
          <div className="name">
            {user?.name || "Attendee Name"}
          </div>

          <div className="role">
            {user?.role === "attendee" && "🎫 Event Attendee"}
            {user?.role === "exhibitor" && "🏢 Exhibitor"}
            {user?.role === "admin" && "👑 Administrator"}
          </div>

          <div className="row">
            <User size={18} />
            {user?.name || "N/A"}
          </div>

          <div className="row">
            <Mail size={18} />
            {user?.email || "N/A"}
          </div>

          <div className="row">
            <Phone size={18} />
            {user?.phone || "Not provided"}
          </div>

          <div className="row">
            <MapPin size={18} />
            {user?.location || "Karachi, Pakistan"}
          </div>

          {/* ✅ EDIT BUTTON - Navigate to Profile Page */}
          <button className="edit-btn" onClick={handleEditProfile}>
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}