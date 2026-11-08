import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, MapPin, Edit3, Save, X, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ExhibitorProfile.css";

export default function ExhibitorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    location: "",
  });

  // ✅ Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  // ✅ Fetch exhibitor profile from backend
  const fetchProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // Try to get user email from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      let email = storedUser.email;

      let response;
      if (email) {
        response = await axios.get(
          `http://localhost:1000/api/users/profile-by-email?email=${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Fallback to token-based profile
        response = await axios.get("http://localhost:1000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        const userData = response.data.user;
        setProfile(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          company: userData.company || "",
          location: userData.location || "Karachi, Pakistan",
        });
      } else {
        toast.error(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile in backend
  const handleUpdate = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const email = storedUser.email;

      const response = await axios.put(
        `http://localhost:1000/api/users/update-profile-by-email?email=${email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(response.data.user);
        // Update localStorage user info
        const updatedUser = { ...storedUser, name: response.data.user.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // ✅ Trigger navbar update
        window.dispatchEvent(new Event("userProfileUpdated"));
        
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Navigate back to profile page (or dashboard)
  const handleBackToProfile = () => {
    navigate("/profilepage?role=exhibitor");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Get initials for avatar
  const getInitials = () => {
    if (!profile?.name) return "E";
    return profile.name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <motion.div className="profile-card">
          <div className="avatar-box">...</div>
          <div className="info">
            <div className="name">Loading...</div>
            <div className="role">Exhibitor</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="avatar-box">!</div>
          <div className="info">
            <div className="name">No Data Found</div>
            <div className="role">Please login again</div>
            <button className="edit-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
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
        {/* BACK BUTTON */}
        {/* <button className="back-btn" onClick={handleBackToProfile}>
          <ArrowLeft size={18} /> Back to Profile
        </button> */}

        {/* AVATAR */}
        <div className="avatar-box">{getInitials()}</div>

        {/* INFO */}
        <div className="info">
          <div className="name">{profile.name}</div>
          <div className="role">Event Exhibitor</div>

          {!isEditing ? (
            // ✅ VIEW MODE
            <>
              <div className="row">
                <User size={18} /> {profile.name}
              </div>
              <div className="row">
                <Mail size={18} /> {profile.email}
              </div>
              <div className="row">
                <Phone size={18} /> {profile.phone || "Not provided"}
              </div>
              <div className="row">
                <Building2 size={18} /> {profile.company || "Not provided"}
              </div>
              <div className="row">
                <MapPin size={18} /> {profile.location || "Karachi, Pakistan"}
              </div>
              
              {/* ✅ EDIT BUTTON - Navigates to Edit Profile Page */}
              <button className="edit-btn" onClick={() => navigate("/profilepage?role=exhibitor&edit=true")}>
                <Edit3 size={16} /> Edit Profile
              </button>
            </>
          ) : (
            // ✅ EDIT MODE
            <>
              <div className="row">
                <User size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Full Name"
                />
              </div>
              <div className="row">
                <Mail size={18} />
                <input
                  type="email"
                  value={profile.email}
                  className="edit-input"
                  disabled
                />
                <small className="edit-hint">Email cannot be changed</small>
              </div>
              <div className="row">
                <Phone size={18} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Phone Number"
                />
              </div>
              <div className="row">
                <Building2 size={18} />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Company Name"
                />
              </div>
              <div className="row">
                <MapPin size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="Location"
                />
              </div>
              <div className="edit-buttons">
                <button className="save-btn" onClick={handleUpdate}>
                  <Save size={16} /> Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}