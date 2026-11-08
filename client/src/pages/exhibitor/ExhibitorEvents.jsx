import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ExhibitorEvents.css";

export default function ExhibitorEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:1000/api/admin/events");
      console.log("Events response:", response.data);
      if (response.data.success && response.data.events) {
        setEvents(response.data.events);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      console.error("Fetch events error:", error);
      toast.error("Error loading events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="events-wrapper">
        <h1 className="events-title">Exhibitor Events</h1>
        <div className="loading-spinner">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="events-wrapper">
      <h1 className="events-title">Exhibitor Events</h1>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">No events found.</div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <img
                src={event.coverImage || "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800"}
                alt={event.title}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800";
                }}
              />
              <div className="event-info">
                <h2>{event.title}</h2>
                <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                <p>📍 {event.location}</p>
                <button onClick={() => setSelectedEvent(event)}>
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL / DETAILS POPUP */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedEvent.coverImage || "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800"}
              alt={selectedEvent.title}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800";
              }}
            />
            <h2>{selectedEvent.title}</h2>
            <p>📅 {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
            <p>📍 {selectedEvent.location}</p>
            <p className="desc">{selectedEvent.description}</p>
            <button onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}