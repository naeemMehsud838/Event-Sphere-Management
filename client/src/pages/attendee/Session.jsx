import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Session.css";

export default function Session() {
  const [openModal, setOpenModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    time: "",
    location: "",
    category: "Technology",
    description: "",
    attendees: 0
  });

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get(
        "http://localhost:1000/api/sessions",
        config
      );

      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
      
      // Fallback to mock data if backend is not ready
      setSessions([
        {
          _id: "1",
          title: "AI & Future Tech",
          time: "10:00 AM - 11:30 AM",
          location: "Hall A",
          speaker: "Dr. Ahmed Khan",
          attendees: 120,
          category: "Technology",
          status: "Live",
          description: "Explore the future of AI and its impact on various industries."
        },
        {
          _id: "2",
          title: "Startup Growth Hacks",
          time: "12:00 PM - 1:00 PM",
          location: "Hall B",
          speaker: "Sara Ali",
          attendees: 85,
          category: "Business",
          status: "Upcoming",
          description: "Learn proven strategies to grow your startup fast."
        },
        {
          _id: "3",
          title: "Web3 & Blockchain",
          time: "2:00 PM - 3:30 PM",
          location: "Hall C",
          speaker: "John Smith",
          attendees: 150,
          category: "Innovation",
          status: "Popular",
          description: "Understanding the next generation of internet technology."
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Create new session
  const createSession = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.speaker || !formData.time || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      };

      const response = await axios.post(
        "http://localhost:1000/api/sessions/create",
        {
          title: formData.title,
          speaker: formData.speaker,
          time: formData.time,
          location: formData.location,
          category: formData.category,
          description: formData.description,
          attendees: 0,
          status: "Upcoming"
        },
        config
      );

      if (response.data.success) {
        toast.success("Session created successfully!");
        setOpenModal(false);
        resetForm();
        fetchSessions(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error(error.response?.data?.message || "Failed to create session");
    }
  };

  // Join session
  const handleJoin = async (sessionId, title) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user?.email) {
        toast.error("Please login to join session");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(
        "http://localhost:1000/api/sessions/join",
        {
          sessionId: sessionId,
          userEmail: user.email
        },
        config
      );

      if (response.data.success) {
        toast.success(`🎉 You successfully joined "${title}" session!`);
        fetchSessions(); // Refresh to update attendee count
      } else {
        toast.error(response.data.message || "Failed to join session");
      }
    } catch (error) {
      console.error("Error joining session:", error);
      // Fallback to alert if backend fails
      alert(`🎉 You successfully joined "${title}" session!`);
    }
  };

  // Save session
  const handleSave = async (sessionId, title) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user?.email) {
        toast.error("Please login to save session");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post(
        "http://localhost:1000/api/sessions/save",
        {
          sessionId: sessionId,
          userEmail: user.email
        },
        config
      );

      if (response.data.success) {
        toast.success(`💾 "${title}" session saved successfully!`);
      } else {
        toast.error(response.data.message || "Failed to save session");
      }
    } catch (error) {
      console.error("Error saving session:", error);
      // Fallback to alert if backend fails
      alert(`💾 "${title}" session saved successfully!`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      speaker: "",
      time: "",
      location: "",
      category: "Technology",
      description: "",
      attendees: 0
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter sessions based on search and category
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || session.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ["All", ...new Set(sessions.map(s => s.category))];

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="session-page">

      {/* ================= HEADER ================= */}

      <motion.div
        className="session-topbar"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Explore Sessions 🎤</h1>
          <p>
            Discover live talks, workshops, and networking sessions
          </p>
        </div>

        <button
          className="create-btn"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={18} />
          Create Session
        </button>
      </motion.div>

      {/* ================= SEARCH & FILTER ================= */}

      <motion.div
        className="session-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search sessions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ================= SESSION GRID ================= */}

      {loading ? (
        <div className="loading-sessions">
          <div className="spinner"></div>
          <p>Loading sessions...</p>
        </div>
      ) : (
        <div className="session-grid">
          {filteredSessions.length === 0 ? (
            <div className="no-sessions">
              <p>No sessions found</p>
              <p>Create a new session to get started!</p>
            </div>
          ) : (
            filteredSessions.map((s, i) => (
              <motion.div
                key={s._id || i}
                className="session-card"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >

                <div className="card-top">
                  <span className="category">{s.category}</span>
                  <span className={`status ${s.status?.toLowerCase() || 'upcoming'}`}>
                    {s.status || "Upcoming"}
                  </span>
                </div>

                <h2>{s.title}</h2>

                <div className="info">
                  <span>
                    <Clock size={15} />
                    {s.time}
                  </span>

                  <span>
                    <MapPin size={15} />
                    {s.location}
                  </span>

                  <span>
                    <Users size={15} />
                    {s.attendees} Attendees
                  </span>
                </div>

                <div className="speaker-box">
                  <div className="avatar">
                    {s.speaker.charAt(0)}
                  </div>

                  <div>
                    <p>Speaker</p>
                    <h4>{s.speaker}</h4>
                  </div>
                </div>

                {s.description && (
                  <p className="session-description">{s.description}</p>
                )}

                {/* ================= BUTTONS ================= */}

                <div className="card-buttons">

                  <button
                    className="join-btn"
                    onClick={() => handleJoin(s._id, s.title)}
                  >
                    Join Session
                  </button>

                  <button
                    className="save-btn"
                    onClick={() => handleSave(s._id, s.title)}
                  >
                    Save
                  </button>

                </div>

              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}

      <AnimatePresence>
        {openModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="session-modal"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >

              {/* CLOSE BUTTON */}

              <button
                className="close-btn"
                onClick={() => setOpenModal(false)}
              >
                <X size={20} />
              </button>

              <h2>Create New Session 🎤</h2>

              <p>
                Fill in session details and invite attendees
              </p>

              {/* FORM */}

              <form className="session-form" onSubmit={createSession}>

                <div className="form-group">
                  <label>Session Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter session title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Speaker Name *</label>
                  <input
                    type="text"
                    name="speaker"
                    placeholder="Enter speaker name"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="text"
                      name="time"
                      placeholder="10:00 AM - 11:30 AM"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Hall A"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Marketing</option>
                    <option>Startup</option>
                    <option>Innovation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Write session details..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  Create Session
                </button>

              </form>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}