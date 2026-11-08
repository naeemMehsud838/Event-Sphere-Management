import { useState, useEffect } from "react";
import "./CreateEventModal.css";

function CreateEventModal({ open, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    ticketPrice: "",
    startDate: "",
    endDate: "",
    description: "",
    coverImage: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        category: "",
        location: "",
        ticketPrice: "",
        startDate: "",
        endDate: "",
        description: "",
        coverImage: null
      });
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("location", formData.location);
      submitData.append("ticketPrice", formData.ticketPrice);
      submitData.append("startDate", formData.startDate);
      submitData.append("endDate", formData.endDate);
      submitData.append("description", formData.description);
      
      if (formData.coverImage) {
        submitData.append("coverImage", formData.coverImage);
      }

      // Send to your backend
      const response = await fetch("http://localhost:1000/api/admin/events", {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event has been created successfully! 🎉");
        if (onEventCreated) onEventCreated(data.event);
        onClose();
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="cem-overlay" onClick={onClose}>
        <div className="cem-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cem-header">
            <h2 className="cem-title">
              Create <span>New Event</span>
            </h2>
            <button className="cem-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {error && (
            <div style={{ 
              background: "#fee", 
              color: "#c00", 
              padding: "10px", 
              margin: "10px 20px 0",
              borderRadius: "8px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <form className="cem-body" onSubmit={handleSubmit}>
            <div className="cem-grid">
              {/* Cover Image Upload */}
              <div className="cem-field full">
                <label className="cem-label">Cover Image (Optional)</label>
                <input
                  className="cem-input"
                  type="file"
                  name="coverImage"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleChange}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Max 5MB. Supported: JPEG, PNG, GIF, WebP
                </small>
              </div>

              <div className="cem-field">
                <label className="cem-label">Event Title *</label>
                <input
                  className="cem-input"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Category *</label>
                <select 
                  className="cem-select" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Art">Art</option>
                  <option value="Business">Business</option>
                  <option value="Science">Science</option>
                  <option value="Others">Other</option>
                </select>
              </div>

              <div className="cem-field">
                <label className="cem-label">Location *</label>
                <input
                  className="cem-input"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Ticket Price * ($)</label>
                <input
                  className="cem-input"
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Start Date *</label>
                <input
                  className="cem-input"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">End Date *</label>
                <input
                  className="cem-input"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cem-field full">
                <label className="cem-label">Description *</label>
                <textarea
                  className="cem-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="cem-actions">
              <button
                type="button"
                className="cem-btn cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="cem-btn save"
                disabled={loading}
              >
                {loading ? "Creating..." : "Save Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEventModal;