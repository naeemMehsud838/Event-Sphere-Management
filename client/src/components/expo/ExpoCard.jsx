import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ExpoCard.css";

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", cls: "upcoming" },
  ongoing: { label: "Live Now", cls: "live" },
  completed: { label: "Ended", cls: "completed" },
};

export default function ExpoCard({ expo }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const st = STATUS_CONFIG[expo.status] || STATUS_CONFIG.upcoming;
  const attendees = expo.registeredAttendees || 0;

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

          {expo.coverImage ? (
            <img
              src={expo.coverImage}
              alt={expo.title}
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
              {(expo.title || "E")[0].toUpperCase()}
            </div>
          )}

          <div className="ecard-img-fade" />
          <div className="ecard-shimmer" />

          <div className="ecard-cat-tag">
            {expo.category}
          </div>

          <div className="ecard-status-badge">
            <span className={`ecard-dot ${st.cls}`} />
            {st.label}
          </div>
        </div>

        {/* CONTENT */}
        <div className="ecard-content">

          <div className="ecard-header">

            <h3 className="ecard-title">
              {expo.title}
            </h3>

            <span className="ecard-price">
              {expo.ticketPrice === 0
                ? "FREE"
                : `$${expo.ticketPrice}`}
            </span>

          </div>

          <p className="ecard-desc">
            {expo.description}
          </p>

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
                {expo.location}
              </span>
            </div>

            <div className="ecard-stat">
              <span>📅</span>

              <span>
                {expo.startDate
                  ? new Date(expo.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "TBA"}
              </span>
            </div>

            <div className="ecard-stat">
              <span>👥</span>

              <span>
                {attendees.toLocaleString()} /
                {expo.maxAttendees?.toLocaleString() || "∞"}
              </span>
            </div>
          </div>

          <Link
            to={`/expos/${expo._id}`}
            className="ecard-btn"
          >
            View Details →
          </Link>

        </div>
      </div>
    </div>
  );
}