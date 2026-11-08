import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3, Building, Calendar, Save, X, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminProfile.css";

export default function AdminProfile() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    location: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Stored user from localStorage:", storedUser);
    
    if (storedUser && storedUser.email) {
      fetchAdminProfile(storedUser.email);
    } else {
      setLoading(false);
      toast.error("Please login again");
      navigate("/login");
    }
  }, []);

  const fetchAdminProfile = async (email) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        navigate("/login");
        return;
      }
      
      const response = await axios.get(
        `http://localhost:1000/api/users/profile-by-email?email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Admin Profile Response:", response.data);
      
      if (response.data.success) {
        const userData = response.data.user;
        setAdmin(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          company: userData.company || "",
          location: userData.location || "Karachi, Pakistan"
        });
      } else {
        toast.error(response.data.message || "Failed to load profile");
      }
      
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = admin?.email;
      
      const response = await axios.put(
        `http://localhost:1000/api/users/update-profile-by-email?email=${email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setAdmin(response.data.user);
        
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          name: response.data.user.name,
          phone: response.data.user.phone,
          company: response.data.user.company
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // ✅ Trigger navbar update
        window.dispatchEvent(new Event("userProfileUpdated"));
        
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
      
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Navigate to profile page (main profile view)
  const handleBackToProfile = () => {
    navigate("/profilepage?role=admin");
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="avatar-box">...</div>
          <div className="info">
            <div className="name">Loading...</div>
            <div className="role">Please wait</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!admin) {
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
        transition={{ duration: 0.5 }}
      >
 
        {/* AVATAR */}
        <div className="avatar-box">
          {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
        </div>

        <div className="info">
          {/* NAME */}
          <div className="name">{admin.name}</div>

          {/* ROLE */}
          <div className="role">
            {admin.role === "admin" && "👑 Administrator"}
            {admin.role === "exhibitor" && "🏢 Exhibitor"}
            {admin.role === "attendee" && "🎫 Event Attendee"}
          </div>

          {!isEditing ? (
            // ✅ VIEW MODE
            <>
              <div className="row">
                <User size={18} />
                <span>{admin.name}</span>
              </div>

              <div className="row">
                <Mail size={18} />
                <span>{admin.email}</span>
              </div>

              <div className="row">
                <Phone size={18} />
                <span>{admin.phone || "Not provided"}</span>
              </div>

              <div className="row">
                <Building size={18} />
                <span>{admin.company || "Not provided"}</span>
              </div>

              <div className="row">
                <MapPin size={18} />
                <span>{admin.location || "Karachi, Pakistan"}</span>
              </div>

              <div className="row">
                <Calendar size={18} />
                <span>Joined: {new Date(admin.createdAt).toLocaleDateString()}</span>
              </div>

              {/* ✅ EDIT BUTTON - Navigate to Edit Profile */}
              <button className="edit-btn" onClick={() => navigate("/profilepage?role=admin&edit=true")}>
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
                  value={admin.email}
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
                <Building size={18} />
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
                <button className="save-btn" onClick={handleUpdateProfile}>
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