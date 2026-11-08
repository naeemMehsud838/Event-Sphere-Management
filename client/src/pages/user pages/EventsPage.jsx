import { useState, useRef, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/events/EventCard";
import CreateEventModal from "../../components/events/CreateEventModal";
import "./EventsPage.css";

/* ─── DATA ──────────────────────────────────────────────────── */
const CATEGORIES = [
  "All",
  "Technology",
  "Fashion",
  "Food",
  "Art",
  "Business",
  "Science",
  "Other",
];

const CAT_ICONS = {
  Technology: "💻",
  Fashion: "👗",
  Food: "🍕",
  Art: "🎨",
  Business: "💼",
  Science: "🔬",
  Other: "✨",
};

/* ─── TICKER DATA ───────────────────────────────────────────── */
const TICKER = [
  "🔴 LIVE: AI Summit Dubai",
  "🟡 SOON: Paris Fashion Week",
  "🔴 LIVE: World Food Festival Tokyo",
  "🟣 FEATURED: Art Biennale NYC",
  "🔴 LIVE: Digital Marketing Summit Mumbai",
  "🟡 SOON: Gaming Event Seoul",
  "🟣 FEATURED: Science Event London",
];

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

/* ════════════════════════════════════════════════════════════ */
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const headerRef = useRef(null);

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching events from backend...");
      
      const response = await axios.get(`${API_BASE_URL}/admin/events`);
      
      console.log("✅ API Response:", response.data);
      
      // Extract events array from response
      let eventsArray = [];
      if (response.data.success && Array.isArray(response.data.events)) {
        eventsArray = response.data.events;
      } else if (Array.isArray(response.data)) {
        eventsArray = response.data;
      } else if (response.data.events && Array.isArray(response.data.events)) {
        eventsArray = response.data.events;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        eventsArray = response.data.data;
      }
      
      // Normalize each event
      const normalizedEvents = eventsArray.map(normalizeEvent);
      
      console.log("📦 Normalized events:", normalizedEvents.length);
      setEvents(normalizedEvents);
      setError(null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const isActive = category !== "All" || status !== "All" || search !== "";
  
  const reset = () => {
    setCategory("All");
    setStatus("All");
    setSearch("");
  };

  const filtered = events.filter((e) => {
    const mc = category === "All" || e.category === category;
    const ms = status === "All" || e.status === status;
    const mq = search === "" || 
      (e.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (e.location?.toLowerCase().includes(search.toLowerCase()) || false);
    return mc && ms && mq;
  });

  const handleModalClose = () => {
    setCreateModalOpen(false);
    // Refresh events after modal closes
    fetchEvents();
  };

  // Loading state
  if (loading && events.length === 0) {
    return (
      <div className="ep-root">
        <div className="ep-mesh" />
        <div className="ep-inner">
          <div className="ep-loading">
            <div className="ep-loading-spinner"></div>
            <p>Loading amazing events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <div className="ep-root">
        <div className="ep-mesh" />
        <div className="ep-inner">
          <div className="ep-error">
            <span className="ep-error-glyph">⚠️</span>
            <h3>{error}</h3>
            <button className="ep-retry-btn" onClick={fetchEvents}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ep-root">
        <div className="ep-mesh" />

        <div className="ep-inner">
          {/* ── HERO ── */}
          <header className="ep-hero" ref={headerRef}>
            <div className="ep-hero-left">
              <div className="ep-eyebrow">
                <div className="ep-eyebrow-line" />
                <div className="ep-eyebrow-dot" />
                EventSphere — Event Directory
              </div>
              <h1 className="ep-title">
                Discover the world's
                <br />
                most <em>extraordinary</em>
                <br />
                events
              </h1>
              <p className="ep-subtitle">
                Curated events across technology, art, fashion, science &amp;
                more. Find your next great experience.
              </p>
            </div>
          </header>

          {/* ── TICKER ── */}
          <div className="ep-ticker-wrap">
            <div className="ep-ticker-track">
              {[...TICKER, ...TICKER].map((t, i) => (
                <div key={i} className="ep-ticker-item">
                  {t}
                  <div className="ep-ticker-sep" />
                </div>
              ))}
            </div>
          </div>

          {/* ── FILTER PANEL ── */}
          <div className="ep-filter-panel">
            {/* top: search + select + toggle */}
            <div className="ep-filter-top">
              <div className="ep-search-wrap">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="ep-search"
                  placeholder="Search by title or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="ep-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Live Now</option>
                <option value="completed">Completed</option>
              </select>

              <div className="ep-view-toggle">
                <button
                  className={`ep-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z" />
                  </svg>
                </button>
                <button
                  className={`ep-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ep-filter-divider" />

            {/* bottom: pills + meta */}
            <div className="ep-filter-bottom">
              <div className="ep-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`ep-pill ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat !== "All" && (
                      <span className="ep-pill-icon">{CAT_ICONS[cat]}</span>
                    )}
                    {cat}
                  </button>
                ))}
              </div>

              <div className="ep-filter-meta">
                <div className="ep-count-label">
                  <strong>{filtered.length}</strong> events found
                </div>
                {isActive && (
                  <button className="ep-clear" onClick={reset}>
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="ep-create-wrap">
            <button
              className="ep-create-btn"
              onClick={() => setCreateModalOpen(true)}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Event
            </button>
          </div>

          {/* ── RESULTS HEADER ── */}
          <div className="ep-results-head">
            <h2 className="ep-results-heading">
              {category === "All" ? (
                <>
                  All <span>events</span>
                </>
              ) : (
                <>
                  <span>{category}</span> events
                </>
              )}
            </h2>
            <div className="ep-results-meta">
              {filtered.length} of {events.length} total
            </div>
          </div>

          {/* ── CARDS ── */}
          {filtered.length === 0 ? (
            <div className="ep-empty">
              <span className="ep-empty-glyph">🔍</span>
              <h3 className="ep-empty-title">Nothing found</h3>
              <p className="ep-empty-sub">
                Try adjusting your filters or clearing the search.
              </p>
              <button className="ep-empty-btn" onClick={reset}>
                Reset all filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "ep-grid" : "ep-list"}>
              {filtered.map((eventItem) => (
                <EventCard key={eventItem._id} events={eventItem} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE Event MODAL ── */}
      <CreateEventModal open={createModalOpen} onClose={handleModalClose} />
    </>
  );
}