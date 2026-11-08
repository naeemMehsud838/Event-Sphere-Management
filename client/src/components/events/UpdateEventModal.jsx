import { useState, useEffect } from "react";
import "./CreateEventModal.css";

function UpdateEventModal({ open, onClose, eventData, onEventUpdated }) {
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
  const [imagePreview, setImagePreview] = useState("");
  const [currentEventId, setCurrentEventId] = useState(null);

  // Populate form when eventData is available
  useEffect(() => {
    if (open && eventData) {
      console.log("📥 Received eventData in modal:", eventData);
      
      // Store the event ID separately
      const eventId = eventData._id || eventData.id;
      setCurrentEventId(eventId);
      console.log("📌 Event ID:", eventId);
      
      // Format date for input field (YYYY-MM-DD)
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0];
      };

      setFormData({
        title: eventData.title || "",
        category: eventData.category || "",
        location: eventData.location || "",
        ticketPrice: eventData.ticketPrice || "",
        startDate: formatDate(eventData.startDate),
        endDate: formatDate(eventData.endDate),
        description: eventData.description || "",
        coverImage: null
      });
      
      setImagePreview(eventData.coverImage || "");
      setError("");
    }
  }, [open, eventData]);

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
      setImagePreview("");
      setCurrentEventId(null);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage") {
      if (files[0]) {
        if (files[0].size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          return;
        }
        setFormData({ ...formData, coverImage: files[0] });
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use currentEventId state instead of eventData
    if (!currentEventId) {
      setError("No event ID available. Please close and try again.");
      setLoading(false);
      return;
    }

    // Validate dates
    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
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
      
      console.log("📤 Updating event ID:", currentEventId);
      console.log("📤 Data being sent:", {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        ticketPrice: formData.ticketPrice,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description.substring(0, 50) + "..."
      });
      
      const response = await fetch(`http://localhost:1000/api/admin/events/${currentEventId}`, {
        method: "PUT",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event has been updated successfully! 🎉");
        if (onEventUpdated) onEventUpdated(data.event || data);
        onClose();
      } else {
        setError(data.message || "Failed to update event");
      }
    } catch (err) {
      console.error("Error updating event:", err);
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
              Update <span>Event</span>
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
              {/* Current Image Preview */}
              {imagePreview && (
                <div className="cem-field full">
                  <label className="cem-label">Current Image</label>
                  <img 
                    src={imagePreview} 
                    alt="Current event" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "150px", 
                      borderRadius: "8px",
                      objectFit: "cover",
                      marginTop: "8px"
                    }} 
                  />
                </div>
              )}

              {/* Cover Image Upload */}
              <div className="cem-field full">
                <label className="cem-label">Change Cover Image (Optional)</label>
                <input
                  className="cem-input"
                  type="file"
                  name="coverImage"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleChange}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Max 5MB. Leave empty to keep current image. Supported: JPEG, PNG, GIF, WebP
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
                {loading ? "Updating..." : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateEventModal;