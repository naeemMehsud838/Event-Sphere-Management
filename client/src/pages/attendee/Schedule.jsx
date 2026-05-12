import { motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import "./Schedule.css";

export default function Schedule() {
  const schedule = [
    {
      time: "10:00 AM",
      title: "AI & Future Tech",
      speaker: "Dr. Ahmed Khan",
      location: "Hall A",
    },
    {
      time: "12:00 PM",
      title: "Startup Growth Hacks",
      speaker: "Sara Ali",
      location: "Hall B",
    },
    {
      time: "2:00 PM",
      title: "Web3 Workshop",
      speaker: "John Smith",
      location: "Hall C",
    },
    {
      time: "4:00 PM",
      title: "Networking Session",
      speaker: "Panel Team",
      location: "Main Hall",
    },
  ];

  return (
    <div className="schedule-page">

      {/* HEADER */}
      <motion.div
        className="schedule-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Event Schedule 📅</h1>
        <p>Your complete day timeline in one place</p>
      </motion.div>

      {/* TIMELINE */}
      <div className="timeline">

        {schedule.map((item, i) => (
          <motion.div
            key={i}
            className="schedule-card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <div className="time">
              <Clock size={16} /> {item.time}
            </div>

            <h2>{item.title}</h2>

            <div className="meta">
              <span><User size={14} /> {item.speaker}</span>
              <span><MapPin size={14} /> {item.location}</span>
            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
}