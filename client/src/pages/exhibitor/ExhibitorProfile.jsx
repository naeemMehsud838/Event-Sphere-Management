import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, MapPin, Edit3 } from "lucide-react";
import "./ExhibitorProfile.css";

export default function ExhibitorProfile() {
  return (
    <div className="profile-wrapper">

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* AVATAR */}
        <div className="avatar-box">
          E
        </div>

        {/* INFO */}
        <div className="info">

          <div className="name">Exhibitor Name</div>
          <div className="role">Event Exhibitor</div>

          <div className="row">
            <User size={18} />
            John Doe
          </div>

          <div className="row">
            <Mail size={18} />
            exhibitor@email.com
          </div>

          <div className="row">
            <Phone size={18} />
            +92 300 9876543
          </div>

          <div className="row">
            <Building2 size={18} />
            Tech Solutions Pvt Ltd
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