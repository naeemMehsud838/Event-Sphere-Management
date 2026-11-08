import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MyBooth.css";

// Icons (you can replace with lucide-react if you want)
const Search = () => <span>🔍</span>;
const Filter = () => <span>⚙️</span>;
const MapPin = () => <span>📍</span>;
const Star = () => <span>⭐</span>;
const EmailIcon = () => <span>📧</span>;

export default function MyBooth() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch only this exhibitor's booths
  const fetchMyBooths = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:1000/api/booths/my-booth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBooths(res.data.booths || []);
      } else {
        toast.error(res.data.message || "Failed to load booths");
      }
    } catch (error) {
      console.error("Fetch booths error:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooths();
  }, []);

  // Filter by booth title
  const filteredBooths = booths.filter((booth) =>
    booth.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="booth-page">
        <div className="booth-header1">
          <h1>🚀 My Expo Booths</h1>
          <p>Loading your booths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booth-page">
      {/* HEADER */}
      <motion.div
        className="booth-header1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>🚀 My Expo Booths</h1>
        <p>All the booths you have created – manage and showcase them here</p>

        <div className="booth-actions">
          <div className="search-box">
            <Search />
            <input
              placeholder="Search booths..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn" onClick={() => navigate("/exhibitor/create-booth")}>
            + Create New Booth
          </button>
        </div>
      </motion.div>

      {/* BOOTH GRID */}
      {filteredBooths.length === 0 ? (
        <div className="no-booths">
          <div className="empty-state">
            <span>📦</span>
            <h3>No booths found</h3>
            <p>You haven't created any booths yet. Click the button above to get started.</p>
            <button onClick={() => navigate("/exhibitor/create-booth")}>Create Your First Booth</button>
          </div>
        </div>
      ) : (
        <div className="booth-grid">
          {filteredBooths.map((booth, index) => (
            <motion.div
              key={booth._id}
              className="booth-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              {/* CARD BANNER */}
              <div className="card-banner">
                <span className="category">{booth.category}</span>
                <span className={`status ${booth.status}`}>
                  {booth.status === "pending" ? "⏳ Pending" : booth.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                </span>
              </div>

              {/* CARD CONTENT */}
              <div className="card-content">
                <h2>{booth.title}</h2>
                <p className="description">{booth.description || "No description provided."}</p>

                {/* FOOTER META */}
                <div className="booth-footer">
                  <div className="location">
                    <MapPin /> {booth.location || "Not specified"}
                  </div>
                  <div className="contact">
                    <EmailIcon /> {booth.email}
                  </div>
                </div>

                {/* BUTTON */}
                <motion.button
                  className="visit-btn"
                  onClick={() => navigate(`/exhibitor/booth/${booth._id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}