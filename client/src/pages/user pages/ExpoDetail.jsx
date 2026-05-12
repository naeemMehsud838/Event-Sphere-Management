import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ExpoDetail.css";
import UpdateExpoModal from "../../components/expo/UpdateExpoModal";

// Static Expo Data (same as ExposPage)
const STATIC_EXPOS = [
  {
    _id: "1",
    title: "AI & Robotics Summit 2026",
    description:
      "Explore the future of artificial intelligence and robotics with industry leaders and innovators from around the globe.",
    location: "Dubai, UAE",
    startDate: "2026-08-15",
    endDate: "2026-08-17",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    maxAttendees: 5000,
    registeredAttendees: 3240,
    ticketPrice: 299,
    tags: ["AI", "Robotics", "Innovation", "Tech"],
  },
  {
    _id: "2",
    title: "Global Fashion Week",
    description:
      "Witness the latest fashion trends, designer collections, and runway shows from top fashion houses worldwide.",
    location: "Paris, France",
    startDate: "2026-09-20",
    endDate: "2026-09-25",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    maxAttendees: 3000,
    registeredAttendees: 2890,
    ticketPrice: 450,
    tags: ["Fashion", "Design", "Runway", "Style"],
  },
  {
    _id: "3",
    title: "World Food Festival",
    description:
      "A culinary journey featuring world-class chefs, food tastings, cooking demonstrations, and gastronomic excellence.",
    location: "Tokyo, Japan",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    category: "Food",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    maxAttendees: 4500,
    registeredAttendees: 4200,
    ticketPrice: 180,
    tags: ["Food", "Culinary", "Chefs", "Gastronomy"],
  },
  {
    _id: "4",
    title: "Contemporary Art Expo",
    description:
      "Discover groundbreaking contemporary art from emerging and established artists across various mediums and styles.",
    location: "New York, USA",
    startDate: "2026-10-05",
    endDate: "2026-10-08",
    category: "Art",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg",
    maxAttendees: 2500,
    registeredAttendees: 1850,
    ticketPrice: 120,
    tags: ["Art", "Gallery", "Contemporary", "Exhibition"],
  },
  {
    _id: "5",
    title: "Global Business Summit",
    description:
      "Connect with business leaders, investors, and entrepreneurs to discuss market trends, innovations, and opportunities.",
    location: "Singapore",
    startDate: "2026-06-15",
    endDate: "2026-06-18",
    category: "Business",
    status: "completed",
    coverImage:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    maxAttendees: 6000,
    registeredAttendees: 5800,
    ticketPrice: 599,
    tags: ["Business", "Networking", "Investment", "Leadership"],
  },
  {
    _id: "6",
    title: "Science & Innovation Expo",
    description:
      "Showcasing cutting-edge scientific research, breakthrough discoveries, and innovative technologies shaping our future.",
    location: "London, UK",
    startDate: "2026-11-22",
    endDate: "2026-11-24",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
    maxAttendees: 4000,
    registeredAttendees: 2650,
    ticketPrice: 250,
    tags: ["Science", "Research", "Innovation", "Discovery"],
  },
  {
    _id: "7",
    title: "Tech Startup Conference",
    description:
      "Meet innovative startups, pitch to investors, and explore emerging technologies disrupting traditional industries.",
    location: "San Francisco, USA",
    startDate: "2026-08-28",
    endDate: "2026-08-30",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    maxAttendees: 3500,
    registeredAttendees: 3100,
    ticketPrice: 350,
    tags: ["Startups", "Tech", "Innovation", "Venture Capital"],
  },
  {
    _id: "8",
    title: "Sustainable Living Fair",
    description:
      "Learn about eco-friendly products, renewable energy, sustainable practices, and green innovations for a better planet.",
    location: "Copenhagen, Denmark",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    category: "Other",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    maxAttendees: 2800,
    registeredAttendees: 2200,
    ticketPrice: 95,
    tags: ["Sustainability", "Green", "Eco", "Environment"],
  },
  {
    _id: "9",
    title: "Digital Marketing Summit",
    description:
      "Master the latest digital marketing strategies, SEO techniques, social media trends, and growth hacking methods.",
    location: "Mumbai, India",
    startDate: "2026-07-25",
    endDate: "2026-07-27",
    category: "Business",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    maxAttendees: 5500,
    registeredAttendees: 5200,
    ticketPrice: 199,
    tags: ["Marketing", "Digital", "SEO", "Growth"],
  },
  {
    _id: "10",
    title: "Gaming & Esports Expo",
    description:
      "Experience the latest gaming titles, meet professional esports players, and discover gaming hardware and innovations.",
    location: "Seoul, South Korea",
    startDate: "2026-12-08",
    endDate: "2026-12-10",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
    maxAttendees: 8000,
    registeredAttendees: 6800,
    ticketPrice: 149,
    tags: ["Gaming", "Esports", "Technology", "Entertainment"],
  },
  {
    _id: "11",
    title: "Luxury Fashion Summit",
    description:
      "Exclusive showcase of haute couture, luxury brands, and high-end fashion innovations from around the world.",
    location: "Milan, Italy",
    startDate: "2026-10-12",
    endDate: "2026-10-15",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    maxAttendees: 1800,
    registeredAttendees: 1420,
    ticketPrice: 750,
    tags: ["Luxury", "Couture", "HighFashion", "Designer"],
  },
  {
    _id: "12",
    title: "International Street Food Festival",
    description:
      "Taste authentic street food from 50+ countries with live cooking shows and culinary competitions.",
    location: "Bangkok, Thailand",
    startDate: "2026-08-05",
    endDate: "2026-08-07",
    category: "Food",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    maxAttendees: 12000,
    registeredAttendees: 10800,
    ticketPrice: 89,
    tags: ["StreetFood", "Culinary", "Festival", "Global"],
  },
  {
    _id: "13",
    title: "Modern Art & Design Fair",
    description:
      "Celebrate contemporary art, design, and architecture with immersive installations and artist talks.",
    location: "Berlin, Germany",
    startDate: "2026-09-18",
    endDate: "2026-09-21",
    category: "Art",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg",
    maxAttendees: 3200,
    registeredAttendees: 2780,
    ticketPrice: 220,
    tags: ["ModernArt", "Design", "Architecture", "Installation"],
  },
  {
    _id: "14",
    title: "Quantum Computing Conference",
    description:
      "Explore quantum algorithms, hardware breakthroughs, and practical applications of quantum technology.",
    location: "Boston, USA",
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/3559483/pexels-photo-3559483.jpeg",
    maxAttendees: 2200,
    registeredAttendees: 1980,
    ticketPrice: 650,
    tags: ["Quantum", "Computing", "Science", "Research"],
  },
  {
    _id: "15",
    title: "Sustainable Fashion Expo",
    description:
      "Showcasing eco-friendly fashion, circular economy, and ethical production practices for the future.",
    location: "Amsterdam, Netherlands",
    startDate: "2026-07-30",
    endDate: "2026-08-01",
    category: "Fashion",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1461260/pexels-photo-1461260.jpeg",
    maxAttendees: 2600,
    registeredAttendees: 2340,
    ticketPrice: 175,
    tags: ["Sustainable", "EcoFashion", "Ethical", "Circular"],
  },
  {
    _id: "16",
    title: "HealthTech & Biotech Summit",
    description:
      "Revolutionary healthcare technologies, medical AI, biotech innovations, and digital health solutions.",
    location: "Zurich, Switzerland",
    startDate: "2026-09-28",
    endDate: "2026-09-30",
    category: "Technology",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/4164872/pexels-photo-4164872.jpeg",
    maxAttendees: 4500,
    registeredAttendees: 4120,
    ticketPrice: 525,
    tags: ["HealthTech", "Biotech", "MedicalAI", "Healthcare"],
  },
  {
    _id: "17",
    title: "Creative Directors Forum",
    description:
      "Where top creative directors share strategies for brand storytelling, visual identity, and innovation.",
    location: "Los Angeles, USA",
    startDate: "2026-06-22",
    endDate: "2026-06-24",
    category: "Business",
    status: "ongoing",
    coverImage:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    maxAttendees: 1500,
    registeredAttendees: 1480,
    ticketPrice: 799,
    tags: ["Creative", "Branding", "Design", "Leadership"],
  },
  {
    _id: "18",
    title: "Space Tech & Aerospace Expo",
    description:
      "Latest in space exploration, satellite technology, aerospace engineering, and commercial spaceflight.",
    location: "Cape Canaveral, USA",
    startDate: "2026-12-15",
    endDate: "2026-12-17",
    category: "Science",
    status: "upcoming",
    coverImage:
      "https://images.pexels.com/photos/1166751/pexels-photo-1166751.jpeg",
    maxAttendees: 6800,
    registeredAttendees: 5920,
    ticketPrice: 425,
    tags: ["Space", "Aerospace", "Satellite", "Exploration"],
  },
];

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const expo = STATIC_EXPOS.find((e) => e._id === id);

  if (!expo) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--ep-bg)",
          color: "var(--ep-text)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
          <p style={{ marginBottom: "2rem" }}>Expo not found</p>
          <Link
            to="/expos"
            style={{
              padding: "12px 32px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #6c6d91, #340536)",
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to Expos
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[expo.status] || STATUS_CONFIG.upcoming;
  const attendancePercentage = (
    (expo.registeredAttendees / expo.maxAttendees) *
    100
  ).toFixed(0);

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
            <Link to="/expos" className="ed-back">
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
              Back to Expos
            </Link>

            {/* 👇 NEW: Admin Action Buttons */}
            <div className="ed-admin-actions">
              <button
                className="ed-admin-btn ed-admin-update"
                onClick={() => setShowUpdateModal(true)}
                title="Update Expo"
              >
                ✏️ Edit
              </button>
              <button
                className="ed-admin-btn ed-admin-delete"
                onClick={() => {
                  if (
                    confirm(
                      `🗑️ Delete "${expo.title}"?\n\nThis expo will be permanently deleted.`,
                    )
                  ) {
                    alert(`✅ "${expo.title}" deleted successfully!`);
                  }
                }}
                title="Delete Expo"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="ed-hero">
            <img
              src={expo.coverImage}
              alt={expo.title}
              className="ed-hero-img"
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
                    {new Date(expo.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" - "}
                    {new Date(expo.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="ed-meta-item">
                  <span>👥</span>
                  <span>
                    {expo.registeredAttendees.toLocaleString()} attending
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
                    <p className="ed-description">
                      Whether you're looking to network, learn about the latest
                      trends, or showcase your innovations, this expo offers
                      something for everyone. Don't miss this opportunity to be
                      part of something extraordinary.
                    </p>

                    {expo.tags && expo.tags.length > 0 && (
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
                          {expo.location}
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
                          {new Date(expo.startDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                          {" - "}
                          {new Date(expo.endDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
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
                          {expo.category}
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
                          {expo.maxAttendees.toLocaleString()} attendees maximum
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
                  {expo.ticketPrice === 0 ? "FREE" : `$${expo.ticketPrice}`}
                </div>
                <div className="ed-price-label">Per ticket</div>

                <button
                  className="ed-register-btn"
                  onClick={() => navigate("/login")}
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
                      {expo.registeredAttendees.toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">
                      <span>🎟️</span>
                      Available Spots
                    </span>
                    <span className="ed-stat-value">
                      {(
                        expo.maxAttendees - expo.registeredAttendees
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="ed-stat-row">
                    <span className="ed-stat-label">
                      <span>📍</span>
                      Location
                    </span>
                    <span className="ed-stat-value">{expo.location}</span>
                  </div>
                </div>

                <div className="ed-progress-bar">
                  <div
                    className="ed-progress-fill"
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
                <div className="ed-progress-text">
                  {attendancePercentage}% filled •{" "}
                  {expo.maxAttendees - expo.registeredAttendees} spots remaining
                </div>
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
                    📱
                  </button>
                  <button
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
                    ✉️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 👇 Update Modal */}
      <UpdateExpoModal
        expo={expo}
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
    </>
  );
}
