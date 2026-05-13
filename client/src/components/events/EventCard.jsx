// import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EventCard.css";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", cls: "upcoming" },
  ongoing: { label: "Live Now", cls: "live" },
  completed: { label: "Ended", cls: "completed" },
};

export default function EventCard({ events }) {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const isAdmin = window.location.pathname.includes("/admin");
    const url = isAdmin
      ? `/admin/adminEvents/${events._id}`
      : `/events/${events._id}`;
    navigate(url);
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const st = STATUS_CONFIG[events.status] || STATUS_CONFIG.upcoming;
  const attendees = events.registeredAttendees || 0;

  return (
    <div
      className="ecard-wrapper"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity .4s .1s",
      }}
    >
      <div className="ecard-inner">
        {/* IMAGE */}
        <div className="ecard-img-box">
          {events.coverImage ? (
            <img
              src={events.coverImage}
              alt={events.title}
              className="ecard-img"
              loading="lazy"
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(140deg, var(--darkest) 0%, var(--deep) 50%, var(--primary) 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                fontWeight: "900",
                color: "var(--accent)",
                opacity: 0.12,
                letterSpacing: "-0.08em",
                userSelect: "none",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {(events.title || "E")[0].toUpperCase()}
            </div>
          )}

          <div className="ecard-img-fade" />
          <div className="ecard-shimmer" />

          <div className="ecard-cat-tag">{events.category}</div>

          <div className="ecard-status-badge">
            <span className={`ecard-dot ${st.cls}`} />
            {st.label}
          </div>
        </div>

        {/* CONTENT */}
        <div className="ecard-content">
          <div className="ecard-header">
            <h3 className="ecard-title">{events.title}</h3>

            <span className="ecard-price">
              {events.ticketPrice === 0 ? "FREE" : `$${events.ticketPrice}`}
            </span>
          </div>

          <p className="ecard-desc">{events.description}</p>

          <div className="ecard-stats">
            <div className="ecard-stat">
              <span>📍</span>

              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {events.location}
              </span>
            </div>

            <div className="ecard-stat">
              <span>📅</span>

              <span>
                {events.startDate
                  ? new Date(events.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBA"}
              </span>
            </div>

            <div className="ecard-stat">
              <span>👥</span>

              <span>
                {attendees.toLocaleString()} /
                {events.maxAttendees?.toLocaleString() || "∞"}
              </span>
            </div>
          </div>

          <button onClick={handleViewDetails} className="ecard-btn">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
