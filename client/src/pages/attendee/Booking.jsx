
import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin, CheckCircle } from "lucide-react";
import "./Booking.css";

export default function Bookings() {
  const bookings = [
    {
      title: "AI & Future Tech",
      date: "12 June 2026",
      time: "10:00 AM",
      location: "Hall A",
      status: "Confirmed",
    },
    {
      title: "Startup Growth Hacks",
      date: "12 June 2026",
      time: "12:00 PM",
      location: "Hall B",
      status: "Pending",
    },
    {
      title: "Web3 Workshop",
      date: "12 June 2026",
      time: "2:00 PM",
      location: "Hall C",
      status: "Confirmed",
    },
  ];

  return (
    <div className="booking-page">

      {/* HEADER */}
      <motion.div
        className="booking-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>My Bookings 🎟️</h1>
        <p>All your registered sessions & tickets</p>
      </motion.div>

      {/* GRID */}
      <div className="booking-grid">

        {bookings.map((b, i) => (
          <motion.div
            key={i}
            className="booking-card"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            {/* TITLE */}
            <h2>
              <Ticket size={18} /> {b.title}
            </h2>

            {/* INFO */}
            <div className="info">
              <span><Calendar size={14} /> {b.date} • {b.time}</span>
              <span><MapPin size={14} /> {b.location}</span>
            </div>

            {/* STATUS */}
            <div className={`status ${b.status.toLowerCase()}`}>
              <CheckCircle size={14} />
              {b.status}
            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
}