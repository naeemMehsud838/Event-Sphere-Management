import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ExpoDetail.css";
import UpdateExpoModal from "../../components/expo/UpdateExpoModal";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.15)",
  },
  ongoing: { label: "Live Now", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  completed: { label: "Ended", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
};

export default function ExpoDetail() {
  const { id } = useParams();
  console.log("📌 Event ID from URL:", id);
  console.log("📌 Type of ID:", typeof id);
  console.log("📌 ID length:", id?.length);
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Get user role
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(storedUser.role);
    console.log("👤 User role:", storedUser.role);
  }, []);

  // Fetch event details from backend
  useEffect(() => {
    if (id) {
      fetchEventDetails();
    } else {
      console.error("❌ No ID found!");
      toast.error("Invalid event ID");
      navigate("/events");
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching event with ID:", id);
      
      // Check if it's a MongoDB ObjectId (24 characters hex) or numeric ID
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      const isNumericId = /^\d+$/.test(id);
      
      console.log("🔍 Is MongoDB ID:", isMongoId);
      console.log("🔍 Is Numeric ID:", isNumericId);
      
      let response;
      
      if (isMongoId) {
        // Backend real ID - try both admin and public endpoints
        try {
          console.log("📡 Trying public endpoint: http://localhost:1000/api/events/${id}");
          response = await axios.get(`http://localhost:1000/api/events/${id}`);
        } catch (publicError) {
          console.log("Public endpoint failed, trying admin endpoint...");
          response = await axios.get(`http://localhost:1000/api/admin/events/${id}`);
        }
      } else {
        // Static numeric ID - use admin endpoint with static data
        console.log("📡 Using admin endpoint for numeric ID");
        response = await axios.get(`http://localhost:1000/api/admin/events/${id}`);
      }
      
      console.log("📡 API Response status:", response.status);
      console.log("📡 API Response data:", response.data);
      
      // Extract event data from response
      let eventData = null;
      
      if (response.data.success && response.data.event) {
        eventData = response.data.event;
      } else if (response.data.event) {
        eventData = response.data.event;
      } else if (response.data.data && response.data.data.event) {
        eventData = response.data.data.event;
      } else if (response.data._id || response.data.id) {
        eventData = response.data;
      } else {
        eventData = response.data;
      }
      
      if (eventData && (eventData._id || eventData.id)) {
        console.log("✅ Event found:", eventData.title);
        setExpo(eventData);
      } else {
        console.error("❌ No event data in response");
        toast.error("Event not found");
        navigate("/events");
      }
    } catch (error) {
      console.error("❌ Fetch error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 404) {
        toast.error("Event not found (404)");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load event details");
      }
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!confirm(`🗑️ Delete "${expo?.title}"?\n\nThis event will be permanently deleted.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const eventId = expo._id || expo.id;
      
      const response = await axios.delete(
        `http://localhost:1000/api/admin/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Event deleted successfully!");
        navigate("/events");
      } else {
        toast.error(response.data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  // Check if user can edit/delete
  const canEdit = () => {
    if (!userRole) return false;
    if (userRole === "admin") return true;
    if (userRole === "exhibitor" && expo?.organizer?._id) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      return expo.organizer._id === storedUser._id;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="ed-root">
        <div className="ed-mesh" />
        <div className="ed-inner" style={{ textAlign: "center", padding: "80px" }}>
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!expo) {
    return (
      <div className="ed-root">
        <div className="ed-mesh" />
        <div className="ed-inner">
          <div style={{ textAlign: "center", padding: "80px" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
            <p style={{ marginBottom: "2rem" }}>Event not found</p>
            <Link
              to="/events"
              style={{
                padding: "12px 32px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[expo.status] || STATUS_CONFIG.upcoming;
  const attendancePercentage = expo.maxAttendees && expo.maxAttendees > 0
    ? ((expo.registeredAttendees || 0) / expo.maxAttendees * 100).toFixed(0)
    : 0;

  return (
    <>
      <div className="ed-root">
        <div className="ed-mesh" />

        <div className="ed-inner">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Link to="/events" className="ed-back">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Events
            </Link>

            {/* Admin/Exhibitor Action Buttons */}
            {canEdit() && (
              <div className="ed-admin-actions">
                <button
                  className="ed-admin-btn ed-admin-update"
                  onClick={() => setShowUpdateModal(true)}
                  title="Update Event"
                >
                  ✏️ Edit
                </button>
                <button
                  className="ed-admin-btn ed-admin-delete"
                  onClick={handleDelete}
                  title="Delete Event"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          {/* Hero Banner */}
          <div className="ed-hero">
            <img
              src={expo.coverImage || "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"}
              alt={expo.title}
              className="ed-hero-img"
              onError={(e) => {
                e.target.src = "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg";
              }}
            />
            <div className="ed-hero-overlay"></div>
            <div className="ed-hero-content">
              <div className="ed-hero-badges">
                <span
                  className="ed-badge"
                  style={{
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    borderColor: statusConfig.color,
                  }}
                >
                  {statusConfig.label}
                </span>
                <span
                  className="ed-badge"
                  style={{
                    background: "rgba(108,109,145,0.3)",
                    color: "#f5d5e0",
                  }}
                >
                  {expo.category}
                </span>
              </div>

              <h1 className="ed-hero-title">{expo.title}</h1>

              <div className="ed-hero-meta">
                <div className="ed-meta-item">
                  <span>📍</span>
                  <span>{expo.location}</span>
                </div>
                <div className="ed-meta-item">
                  <span>📅</span>
                  <span>
                    {expo.startDate ? new Date(expo.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "TBA"}
                    {" - "}
                    {expo.endDate ? new Date(expo.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "TBA"}
                  </span>
                </div>
                <div className="ed-meta-item">
                  <span>👥</span>
                  <span>
                    {(expo.registeredAttendees || 0).toLocaleString()} attending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="ed-content-grid">
            {/* Main Content */}
            <div>
              {/* Tabs */}
              <div className="ed-tabs">
                <button
                  className={`ed-tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`ed-tab ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`ed-tab ${activeTab === "schedule" ? "active" : ""}`}
                  onClick={() => setActiveTab("schedule")}
                >
                  Schedule
                </button>
              </div>

              {/* Tab Content */}
              <div className="ed-tab-content">
                {activeTab === "overview" && (
                  <>
                    <h2 className="ed-section-title">About This Event</h2>
                    <p className="ed-description">{expo.description}</p>
                    <p className="ed-description">
                      Join us for an unforgettable experience at {expo.title},
                      taking place in {expo.location}. This premier event brings
                      together industry leaders, innovators, and enthusiasts
                      from around the world.
                    </p>

                    {expo.tags && expo.tags.length > 0 && (
                      <>
                        <h3 className="ed-tags-title">Event Tags</h3>
                        <div className="ed-tags">
                          {expo.tags.map((tag, i) => (
                            <span key={i} className="ed-tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    <h2 className="ed-section-title">Event Details</h2>
                    <div style={{ display: "grid", gap: "20px" }}>
                      <div>
                        <h4 className="ed-detail-label">Location</h4>
                        <p className="ed-detail-value">{expo.location}</p>
                      </div>
                      <div>
                        <h4 className="ed-detail-label">Dates</h4>
                        <p className="ed-detail-value">
                          {expo.startDate ? new Date(expo.startDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }) : "TBA"}
                          {" - "}
                          {expo.endDate ? new Date(expo.endDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }) : "TBA"}
                        </p>
                      </div>
                      <div>
                        <h4 className="ed-detail-label">Category</h4>
                        <p className="ed-detail-value">{expo.category}</p>
                      </div>
                      <div>
                        <h4 className="ed-detail-label">Ticket Price</h4>
                        <p className="ed-detail-value">
                          {expo.ticketPrice === 0 ? "FREE" : `$${expo.ticketPrice}`}
                        </p>
                      </div>
                      <div>
                        <h4 className="ed-detail-label">Capacity</h4>
                        <p className="ed-detail-value">
                          {expo.maxAttendees?.toLocaleString() || "Unlimited"} attendees maximum
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "schedule" && (
                  <>
                    <h2 className="ed-section-title">Event Schedule</h2>
                    <p className="ed-description">
                      Detailed schedule information will be available closer to
                      the event date. Stay tuned for updates on keynote
                      speakers, workshops, and networking sessions.
                    </p>
                    <div className="ed-schedule-placeholder">
                      <p>📅 Full schedule coming soon</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="ed-sidebar">
              {/* Pricing Card */}
              <div className="ed-sidebar-card">
                <div className="ed-price-tag">
                  {expo.ticketPrice === 0 ? "FREE" : `$${expo.ticketPrice}`}
                </div>
                <div className="ed-price-label">Per ticket</div>

                <button
                  className="ed-register-btn"
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    if (!user.email) {
                      toast.info("Please login to register");
                      navigate("/login");
                    } else {
                      toast.info("Registration feature coming soon!");
                    }
                  }}
                >
                  Register Now
                </button>

                <div className="ed-stats">
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">👥 Attendees</span>
                    <span className="ed-stat-value">
                      {(expo.registeredAttendees || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">🎟️ Available Spots</span>
                    <span className="ed-stat-value">
                      {((expo.maxAttendees || 0) - (expo.registeredAttendees || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">📍 Location</span>
                    <span className="ed-stat-value">{expo.location}</span>
                  </div>
                </div>

                {expo.maxAttendees && expo.maxAttendees > 0 && (
                  <>
                    <div className="ed-progress-bar">
                      <div
                        className="ed-progress-fill"
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                    <div className="ed-progress-text">
                      {attendancePercentage}% filled •{" "}
                      {(expo.maxAttendees - (expo.registeredAttendees || 0)).toLocaleString()} spots remaining
                    </div>
                  </>
                )}
              </div>

              {/* Organizer Card */}
              {expo.organizer && (
                <div className="ed-sidebar-card">
                  <h3 className="ed-sidebar-title">Organizer</h3>
                  <div className="ed-organizer-info">
                    <div className="ed-organizer-avatar">
                      {expo.organizer.name?.charAt(0)?.toUpperCase() || "E"}
                    </div>
                    <div>
                      <p className="ed-organizer-name">{expo.organizer.name}</p>
                      <p className="ed-organizer-email">{expo.organizer.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share Card */}
              <div className="ed-sidebar-card">
                <h3 className="ed-sidebar-title">Share Event</h3>
                <div className="ed-share-buttons">
                  <button
                    className="ed-share-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    🔗 Copy Link
                  </button>
                  <button
                    className="ed-share-btn"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: expo.title,
                          text: expo.description,
                          url: window.location.href,
                        });
                      } else {
                        toast.info("Share feature not supported");
                      }
                    }}
                  >
                    📤 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateExpoModal
          expo={expo}
          open={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            fetchEventDetails();
          }}
        />
      )}
    </>
  );
}