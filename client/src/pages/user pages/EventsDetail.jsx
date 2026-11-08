 import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EventsDetail.css";
import ErrorPage from "../ErrorPage";
import UpdateEventModal from "../../components/events/UpdateEventModal";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.15)",
  },
  ongoing: { label: "Live Now", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  completed: { label: "Ended", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
};

// API Base URL
const API_BASE_URL = "http://localhost:1000/api";

// Function to normalize MongoDB BSON data
const normalizeEvent = (event) => {
  if (!event) return event;
  
  return {
    ...event,
    _id: event._id?.$oid || event._id?.toString() || event._id,
    startDate: event.startDate?.$date || event.startDate,
    endDate: event.endDate?.$date || event.endDate,
    createdAt: event.createdAt?.$date || event.createdAt,
    updatedAt: event.updatedAt?.$date || event.updatedAt,
    organizer: event.organizer?.$oid || event.organizer?.toString() || event.organizer,
    tags: event.tags || [],
  };
};

export default function EventsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Get user role
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(storedUser.role);
  }, []);

  // Fetch event from backend
  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching event with ID:", id);
      
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/admin/events/${id}`);
      } catch (err) {
        console.log("Admin endpoint failed, trying public endpoint...");
        response = await axios.get(`${API_BASE_URL}/events/${id}`);
      }
      
      console.log("✅ API Response:", response.data);
      
      let eventData = null;
      if (response.data.success && response.data.event) {
        eventData = response.data.event;
      } else if (response.data.event) {
        eventData = response.data.event;
      } else if (response.data.data && response.data.data.event) {
        eventData = response.data.data.event;
      } else if (response.data._id || response.data.id) {
        eventData = response.data;
      }
      
      if (eventData) {
        const normalizedEvent = normalizeEvent(eventData);
        setEvents(normalizedEvent);
        setError(null);
      } else {
        throw new Error("Event not found");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.response?.data?.message || "Event not found");
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!confirm(`🗑️ Delete "${events?.title}"?\n\nThis event will be permanently deleted.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/admin/events/${events._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Event deleted successfully!");
        const isAdmin = window.location.pathname.includes("/admin");
        navigate(isAdmin ? "/admin/adminEvents" : "/events");
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
    if (userRole === "exhibitor" && events?.organizer) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      return events.organizer === storedUser._id;
    }
    return false;
  };

  // Loading state
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

  // Error state
  if (error || !events) {
    return <ErrorPage />;
  }

  const statusConfig = STATUS_CONFIG[events.status] || STATUS_CONFIG.upcoming;
  const attendancePercentage = events.maxAttendees && events.maxAttendees > 0
    ? ((events.registeredAttendees || 0) / events.maxAttendees * 100).toFixed(0)
    : 0;

  const isAdmin = window.location.pathname.includes("/admin");

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
            <button
              onClick={() => {
                navigate(isAdmin ? "/admin/adminEvents" : "/events");
              }}
              className="back-btn"
            >
              ← Back to Events
            </button>

            {/* Admin Action Buttons - Only show if user can edit */}
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
              src={events.coverImage || "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"}
              alt={events.title}
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
                  {events.category}
                </span>
              </div>

              <h1 className="ed-hero-title">{events.title}</h1>

              <div className="ed-hero-meta">
                <div className="ed-meta-item">
                  <span>📍</span>
                  <span>{events.location}</span>
                </div>
                <div className="ed-meta-item">
                  <span>📅</span>
                  <span>
                    {events.startDate
                      ? new Date(events.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                    {" - "}
                    {events.endDate
                      ? new Date(events.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </span>
                </div>
                <div className="ed-meta-item">
                  <span>👥</span>
                  <span>
                    {(events.registeredAttendees || 0).toLocaleString()} attending
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
                    <p className="ed-description">{events.description}</p>
                    <p className="ed-description">
                      Join us for an unforgettable experience at {events.title},
                      taking place in {events.location}. This premier event
                      brings together industry leaders, innovators, and
                      enthusiasts from around the world.
                    </p>
                    <p className="ed-description">
                      Whether you're looking to network, learn about the latest
                      trends, or showcase your innovations, this event offers
                      something for everyone. Don't miss this opportunity to be
                      part of something extraordinary.
                    </p>

                    {events.tags && events.tags.length > 0 && (
                      <>
                        <h3
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: 600,
                            marginTop: "32px",
                            marginBottom: "16px",
                            color: "var(--ed-text)",
                          }}
                        >
                          Event Tags
                        </h3>
                        <div className="ed-tags">
                          {events.tags.map((tag, i) => (
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
                        <h4
                          style={{
                            fontSize: "14px",
                            color: "var(--ed-muted)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Location
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "var(--ed-text)",
                            fontWeight: 600,
                          }}
                        >
                          {events.location}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "14px",
                            color: "var(--ed-muted)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Duration
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "var(--ed-text)",
                            fontWeight: 600,
                          }}
                        >
                          {events.startDate
                            ? new Date(events.startDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "TBA"}
                          {" - "}
                          {events.endDate
                            ? new Date(events.endDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "TBA"}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "14px",
                            color: "var(--ed-muted)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Category
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "var(--ed-text)",
                            fontWeight: 600,
                          }}
                        >
                          {events.category}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "14px",
                            color: "var(--ed-muted)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Ticket Price
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "var(--ed-text)",
                            fontWeight: 600,
                          }}
                        >
                          {events.ticketPrice === 0 ? "FREE" : `$${events.ticketPrice}`}
                        </p>
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "14px",
                            color: "var(--ed-muted)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Capacity
                        </h4>
                        <p
                          style={{
                            fontSize: "16px",
                            color: "var(--ed-text)",
                            fontWeight: 600,
                          }}
                        >
                          {events.maxAttendees?.toLocaleString() || "Unlimited"} attendees maximum
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
                    <div
                      style={{
                        marginTop: "24px",
                        padding: "24px",
                        background: "var(--ed-surface)",
                        borderRadius: "16px",
                        border: "1px solid var(--ed-border)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--ed-sub)",
                          textAlign: "center",
                        }}
                      >
                        📅 Full schedule coming soon
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="ed-sidebar">
              {/* Pricing Card */}
              <div className="ed-sidebar-card" style={{ position: "relative" }}>
                <div className="ed-price-tag">
                  {events.ticketPrice === 0 ? "FREE" : `$${events.ticketPrice}`}
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

                <div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">
                      <span>👥</span>
                      Attendees
                    </span>
                    <span className="ed-stat-value">
                      {(events.registeredAttendees || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">
                      <span>🎟️</span>
                      Available Spots
                    </span>
                    <span className="ed-stat-value">
                      {((events.maxAttendees || 0) - (events.registeredAttendees || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">
                      <span>📍</span>
                      Location
                    </span>
                    <span className="ed-stat-value">{events.location}</span>
                  </div>
                </div>

                {events.maxAttendees && events.maxAttendees > 0 && (
                  <>
                    <div className="ed-progress-bar">
                      <div
                        className="ed-progress-fill"
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                    <div className="ed-progress-text">
                      {attendancePercentage}% filled •{" "}
                      {(events.maxAttendees - (events.registeredAttendees || 0)).toLocaleString()} spots remaining
                    </div>
                  </>
                )}
              </div>

              {/* Share Card */}
              <div className="ed-sidebar-card" style={{ position: "relative" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "16px",
                    color: "var(--ed-text)",
                  }}
                >
                  Share Event
                </h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid var(--ed-border)",
                      background: "var(--ed-surface)",
                      color: "var(--ed-text)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontWeight: 600,
                      fontSize: "24px",
                    }}
                  >
                    🔗
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: events.title,
                          text: events.description,
                          url: window.location.href,
                        });
                      } else {
                        toast.info("Share feature not supported");
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid var(--ed-border)",
                      background: "var(--ed-surface)",
                      color: "var(--ed-text)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontWeight: 600,
                      fontSize: "24px",
                    }}
                  >
                    📤
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      // In EventsDetail.jsx, update the modal section:

{/* Update Modal */}
<UpdateEventModal
  open={showUpdateModal}
  onClose={() => {
    setShowUpdateModal(false);
  }}
  eventData={events}  // Make sure events is not null
  onEventUpdated={(updatedEvent) => {
    console.log("🔄 Event updated:", updatedEvent);
    // Refresh the event data
    const normalizedEvent = normalizeEvent(updatedEvent);
    setEvents(normalizedEvent);
    toast.success("Event updated successfully!");
    setShowUpdateModal(false);
  }}
/>
      
    </>
  );
}