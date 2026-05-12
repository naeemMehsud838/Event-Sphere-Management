import { motion } from "framer-motion";
import {  Clock, MapPin, Users } from "lucide-react";
import "./Session.css";

export default function Session() {
  const sessions = [
    {
      title: "AI & Future Tech",
      time: "10:00 AM - 11:30 AM",
      location: "Hall A",
      speaker: "Dr. Ahmed Khan",
      attendees: 120,
    },
    {
      title: "Startup Growth Hacks",
      time: "12:00 PM - 1:00 PM",
      location: "Hall B",
      speaker: "Sara Ali",
      attendees: 85,
    },
    {
      title: "Web3 & Blockchain",
      time: "2:00 PM - 3:30 PM",
      location: "Hall C",
      speaker: "John Smith",
      attendees: 150,
    },
  ];

  return (
    <div className="session-page">

      {/* HEADER */}
      <motion.div
        className="session-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Today’s Sessions 🎤</h1>
        <p>Join live sessions and interact with speakers</p>
      </motion.div>

      {/* GRID */}
      <div className="session-grid">

        {sessions.map((s, i) => (
          <motion.div
            key={i}
            className="session-card"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h2>{s.title}</h2>

            <div className="info">
              <span><Clock size={14} /> {s.time}</span>
              <span><MapPin size={14} /> {s.location}</span>
              <span><Users size={14} /> {s.attendees} Attendees</span>
            </div>

            <div className="speaker">
              <span>Speaker:</span> {s.speaker}
            </div>

            <button className="join-btn">Join Session</button>

          </motion.div>
        ))}

      </div>

    </div>
  );
}