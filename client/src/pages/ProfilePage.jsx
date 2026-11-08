import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = searchParams.get("role") || "attendee";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    bio: "",
    location: "",
    avatar: "",
  });

  // Theme state
  const [theme, setTheme] = useState(
    () => localStorage.getItem("es-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("es-theme", theme);
  }, [theme]);

  const getToken = () => localStorage.getItem("token");

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const email = storedUser.email;

      if (!email) {
        toast.error("User not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:1000/api/users/profile-by-email?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setForm({
          name: userData.name || "",
          phone: userData.phone || "",
          company: userData.company || "",
          bio: userData.bio || "",
          location: userData.location || "Karachi, Pakistan",
          avatar: userData.avatar || "",
        });
      } else {
        toast.error(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update profile in backend
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   try {
  //     const token = getToken();
  //     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  //     const email = storedUser.email;

  //     const response = await axios.put(
  //       `http://localhost:1000/api/users/update-profile-by-email?email=${email}`,
  //       {
  //         name: form.name,
  //         phone: form.phone,
  //         company: form.company,
  //         bio: form.bio,
  //         location: form.location,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       toast.success("Profile updated successfully!");
  //       setUser(response.data.user);
  //       // Update localStorage
  //       const updatedUser = {
  //         ...storedUser,
  //         name: response.data.user.name,
  //         phone: response.data.user.phone,
  //         company: response.data.user.company,
  //       };
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     } else {
  //       toast.error(response.data.message || "Failed to update profile");
  //     }
  //   } catch (error) {
  //     console.error("Update profile error:", error);
  //     toast.error("Failed to update profile");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const token = getToken();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const email = storedUser.email;

    const response = await axios.put(
      `http://localhost:1000/api/users/update-profile-by-email?email=${email}`,
      {
        name: form.name,
        phone: form.phone,
        company: form.company,
        bio: form.bio,
        location: form.location,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      toast.success("Profile updated successfully!");
      setUser(response.data.user);
      
      // Update localStorage
      const updatedUser = {
        ...storedUser,
        name: response.data.user.name,
        phone: response.data.user.phone,
        company: response.data.user.company,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // ✅ IMPORTANT: Dispatch event to notify Navbar
      window.dispatchEvent(new Event("userProfileUpdated"));
      
    } else {
      toast.error(response.data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Update profile error:", error);
    toast.error("Failed to update profile");
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Role based info for display
  const roleInfo = {
    admin: {
      title: "System Administrator",
      gradient: "linear-gradient(135deg, #cc73db, #f5d5e0)",
      badge: "ADM",
      icon: "⚙️",
    },
    exhibitor: {
      title: "Exhibitor Partner",
      gradient: "linear-gradient(135deg, #6c6d91, #c06cbf)",
      badge: "EXH",
      icon: "🏪",
    },
    attendee: {
      title: "Event Attendee",
      gradient: "linear-gradient(135deg, #4f1d68, #6c6d91)",
      badge: "ATT",
      icon: "👤",
    },
  };

  const actualRole = user?.role || roleParam;
  const role = roleInfo[actualRole] || roleInfo.attendee;

  // Stats (static for now – can be dynamic later)
  const stats = [
    { label: "Events Registered", value: user?.registeredExpos || 0, icon: "🎪" },
    { label: "Sessions Bookmarked", value: user?.bookmarkedSessions || 0, icon: "📌" },
    {
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "N/A",
      icon: "🗓️",
    },
  ];

  // ✅ ROLE‑BASED QUICK ACTIONS
  const getQuickActions = () => {
    if (actualRole === "admin") {
      return [
        { label: "🏠 Dashboard", path: "/admin" },
        { label: "🎪 Manage Events", path: "/admin/adminEvents" },
        { label: "👥 Attendees", path: "/admin/AdminAttendees" },
        { label: "↩️ Go Back", action: "back" },
      ];
    } else if (actualRole === "exhibitor") {
      return [
        { label: "🏠 Dashboard", path: "/exhibitor" },
        { label: "🎪 Events", path: "/exhibitor/ExhibitorEvents" },
        { label: "🏗️ My Booths", path: "/exhibitor/my-booth" },
        { label: "↩️ Go Back", action: "back" },
      ];
    } else {
      // attendee
      return [
        { label: "🏠 Dashboard", path: "/attendee" },
        { label: "🎪 Browse Events", path: "/events" },
        { label: "🎟️ My Bookings", path: "/attendee/Booking" },
        { label: "↩️ Go Back", action: "back" },
      ];
    }
  };

  const quickActions = getQuickActions();

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-avatar" style={{ background: role.gradient }}>
              ⏳
            </div>
            <h1 className="profile-name">Loading...</h1>
            <p className="profile-email">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-avatar">❌</div>
            <h1 className="profile-name">No Data Found</h1>
            <p className="profile-email">Please login again</p>
            <button onClick={() => navigate("/login")} className="btn-save">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="profile-container">
        {/* Back Button */}
        <Link to="/" className="back-btn">
          ← Back to Home
        </Link>

        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-avatar" style={{ background: role.gradient }}>
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                role.icon
              )}
            </div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="role-badge">
              <span style={{ fontSize: "1.4rem" }}>{role.icon}</span>
              <span>{role.badge}</span>
              <span style={{ opacity: 0.9 }}>•</span>
              <span>{role.title}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Profile Form */}
        <div className="form-section">
          <h2 className="section-title">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={user.email} disabled />
                <small className="form-hint">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Your location"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Bio</label>
                <textarea
                  className="form-textarea"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "⏳ Saving Changes..." : "💾 Save Changes"}
            </button>
          </form>

          {/* Quick Actions – Role‑Based */}
          <div className="quick-actions">
            {quickActions.map((action, idx) => {
              if (action.path) {
                return (
                  <Link key={idx} to={action.path} className="action-btn">
                    <span>{action.label.slice(0, 2)}</span> {action.label.slice(2)}
                  </Link>
                );
              } else if (action.action === "back") {
                return (
                  <button key={idx} onClick={() => navigate(-1)} className="action-btn">
                    <span>↩️</span> Go Back
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}