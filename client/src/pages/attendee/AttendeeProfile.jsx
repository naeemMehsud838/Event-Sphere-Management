import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import "./AttendeeProfile.css";

export default function AttendeeProfile() {
  return (
    <div className="profile-wrapper">

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="avatar-box">A</div>

        <div className="info">
          <div className="name">Attendee Name</div>
          <div className="role">Event Attendee</div>

          <div className="row">
            <User size={18} />
            Maryam Khan
          </div>

          <div className="row">
            <Mail size={18} />
            maryam@email.com
          </div>

          <div className="row">
            <Phone size={18} />
            +92 300 1234567
          </div>

          <div className="row">
            <MapPin size={18} />
            Karachi, Pakistan
          </div>

          <button className="edit-btn">
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

      </motion.div>
    </div>
  );
}