import { useState } from "react";
import "./ExhibitorEvents.css";

const events = [
  {
    id: 1,
    title: "Tech Expo 2026",
    date: "20 June 2026",
    location: "Karachi Expo Center",
    description:
      "A large technology exhibition showcasing startups, AI, and innovation.",
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
  },
  {
    id: 2,
    title: "Startup Summit",
    date: "5 July 2026",
    location: "Lahore Convention Hall",
    description:
      "Meet investors, founders and explore startup opportunities.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
  },
  {
    id: 3,
    title: "AI Conference",
    date: "18 August 2026",
    location: "Islamabad Arena",
    description:
      "Deep learning, machine learning and AI future discussions.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
  },
  {
    id: 4,
    title: "Business Expo",
    date: "2 September 2026",
    location: "Karachi Expo Center",
    description:
      "Networking event for business owners and exhibitors.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
  },
];

export default function ExhibitorEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="events-wrapper">
      <h1 className="events-title">Exhibitor Events</h1>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <img src={event.image} alt={event.title} />

            <div className="event-info">
              <h2>{event.title}</h2>
              <p>📅 {event.date}</p>
              <p>📍 {event.location}</p>

              <button onClick={() => setSelectedEvent(event)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MODAL / EXPANDED VIEW (same page) */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedEvent.image} alt="" />

            <h2>{selectedEvent.title}</h2>
            <p>📅 {selectedEvent.date}</p>
            <p>📍 {selectedEvent.location}</p>
            <p className="desc">{selectedEvent.description}</p>

            <button onClick={() => setSelectedEvent(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}